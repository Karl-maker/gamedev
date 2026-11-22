import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  fetchNotionEmailPage,
  inlineEmailImages,
  loadRecipientsCsv,
  parseRecipientsCsv,
  personalize,
  renderNotionEmail,
  selectRecipients
} from "@/lib/integrations/email/campaign";

describe("email campaign CSV integration", () => {
  it("loads the real CSV fixture, normalizes fields, skips unsubscribed rows, and matches industry without case sensitivity", async () => {
    const file = path.join(process.cwd(), "src", "test", "fixtures", "campaign-recipients.csv");
    const recipients = await loadRecipientsCsv(file);

    expect(recipients).toHaveLength(4);
    expect(recipients[0]).toMatchObject({
      email: "karljohanbailey@syncpoly.com",
      industry: "Developer",
      first_name: "Karl-Johan",
      skip: true
    });
    expect(recipients[0].fields.company).toBe("Syncpoly, Ltd.");
    expect(selectRecipients(recipients, "DeVeLoPeR").map((recipient) => recipient.email)).toEqual([
      "karljohanbailey98@gmail.com",
      "dev@example.com"
    ]);
  });

  it("requires email, industry, and skip and validates boolean values", () => {
    expect(() => parseRecipientsCsv("email,industry\nperson@example.com,Developer")).toThrow(/skip/);
    expect(() => parseRecipientsCsv("email,industry,skip\nperson@example.com,Developer,MAYBE")).toThrow(/TRUE or FALSE/);
  });

  it("personalizes any CSV field while leaving unknown placeholders visible", async () => {
    const file = path.join(process.cwd(), "src", "test", "fixtures", "campaign-recipients.csv");
    const [recipient] = selectRecipients(await loadRecipientsCsv(file), "developer");
    expect(personalize("Hello {{ FIRST-NAME }} from {{company}} — {{unknown}}", recipient)).toBe(
      "Hello Karl-Johan from Personal — {{unknown}}"
    );
  });

  it("defaults a blank or missing first_name to Reader", () => {
    const [blankName] = parseRecipientsCsv(
      "email,industry,first_name,skip\nreader@example.com,News,,FALSE"
    );
    const [missingColumn] = parseRecipientsCsv(
      "email,industry,skip\nother@example.com,News,FALSE"
    );

    expect(personalize("Hello {{first_name}}", blankName)).toBe("Hello Reader");
    expect(personalize("Hello {{first_name}}", missingColumn)).toBe("Hello Reader");
  });
});

describe("Notion email integration", () => {
  it("retrieves paginated and nested Notion content", async () => {
    const retrieve = vi.fn().mockResolvedValue({
      object: "page",
      properties: {
        Name: {
          type: "title",
          title: [{ plain_text: "Hello {{first_name}}", annotations: {} }]
        }
      }
    });
    const list = vi.fn()
      .mockResolvedValueOnce({
        results: [{
          object: "block",
          id: "parent",
          type: "toggle",
          has_children: true,
          toggle: { rich_text: [{ plain_text: "More", annotations: {} }] }
        }],
        has_more: true,
        next_cursor: "next"
      })
      .mockResolvedValueOnce({
        results: [{
          object: "block",
          id: "child",
          type: "paragraph",
          has_children: false,
          paragraph: { rich_text: [{ plain_text: "Nested", annotations: {} }] }
        }],
        has_more: false,
        next_cursor: null
      })
      .mockResolvedValueOnce({
        results: [{
          object: "block",
          id: "second",
          type: "paragraph",
          has_children: false,
          paragraph: { rich_text: [{ plain_text: "Second page", annotations: {} }] }
        }],
        has_more: false,
        next_cursor: null
      });
    const notion = {
      pages: { retrieve },
      blocks: { children: { list } }
    };

    const page = await fetchNotionEmailPage(notion as never, "page-id");
    expect(page.title).toBe("Hello {{first_name}}");
    expect(page.blocks).toHaveLength(2);
    expect(page.blocks[0].children?.[0].id).toBe("child");
    expect(list).toHaveBeenCalledWith({ block_id: "page-id", page_size: 100 });
    expect(list).toHaveBeenCalledWith({ block_id: "page-id", page_size: 100, start_cursor: "next" });
  });

  it("renders rich links, images, tables, and personalized body content", () => {
    const blocks = [
      {
        id: "p",
        type: "paragraph",
        paragraph: {
          rich_text: [
            { plain_text: "Hello {{first_name}}. ", annotations: { bold: true } },
            { plain_text: "Read more", href: "/services", annotations: {} }
          ]
        }
      },
      {
        id: "image",
        type: "image",
        image: {
          external: { url: "https://cdn.example.com/image.png" },
          caption: [{ plain_text: "A useful chart", annotations: {} }]
        }
      },
      {
        id: "table",
        type: "table",
        table: {},
        children: [{
          id: "row",
          type: "table_row",
          table_row: {
            cells: [
              [{ plain_text: "Plan", annotations: {} }],
              [{ plain_text: "Price", annotations: {} }]
            ]
          }
        }]
      }
    ];

    const rendered = renderNotionEmail(blocks, "https://syncpoly.com");
    expect(rendered.html).toContain('href="https://syncpoly.com/services"');
    expect(rendered.html).toContain('src="https://cdn.example.com/image.png"');
    expect(rendered.html).toContain("<table");
    expect(rendered.html).toContain("<td");
    expect(rendered.text).toContain("A useful chart");
    expect(rendered.text).toContain("Plan\tPrice");
  });

  it("downloads rendered images as durable inline email attachments", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]), {
      status: 200,
      headers: { "content-type": "image/png" }
    }));
    const result = await inlineEmailImages(
      '<p>Before</p><img src="https://files.example.com/a.png?x=1&amp;y=2"><p>After</p>',
      fetcher
    );

    expect(fetcher).toHaveBeenCalledWith("https://files.example.com/a.png?x=1&y=2");
    expect(result.html).toContain('src="cid:notion-image-0@syncpoly"');
    expect(result.attachments[0]).toMatchObject({
      filename: "notion-image-0.png",
      cid: "notion-image-0@syncpoly",
      contentType: "image/png"
    });
    expect(result.attachments[0].content).toEqual(Buffer.from([1, 2, 3]));
  });
});
