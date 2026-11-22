import Image from "next/image";
import { personalizePublicContent } from "@/lib/integrations/content/personalization";
import type { ContentBlock, RichText } from "@/lib/integrations/content/types";

function Rich({ items = [] }: { items?: RichText[] }) {
  return items.map((item, index) => {
    let content: React.ReactNode = personalizePublicContent(item.plain_text);
    if (item.annotations?.code) content = <code>{content}</code>;
    if (item.annotations?.bold) content = <strong>{content}</strong>;
    if (item.annotations?.italic) content = <em>{content}</em>;
    if (item.annotations?.strikethrough) content = <s>{content}</s>;
    if (item.href) content = <a href={item.href}>{content}</a>;
    return <span key={index}>{content}</span>;
  });
}

function value(block: ContentBlock) {
  return block[block.type] as Record<string, unknown> | undefined;
}

function Block({ block }: { block: ContentBlock }) {
  const data = value(block);
  const rich = data?.rich_text as RichText[] | undefined;
  const children = block.children?.length ? <NotionRenderer blocks={block.children} /> : null;
  switch (block.type) {
    case "paragraph": return <p><Rich items={rich} />{children}</p>;
    case "heading_1": return <h2><Rich items={rich} /></h2>;
    case "heading_2": return <h2><Rich items={rich} /></h2>;
    case "heading_3": return <h3><Rich items={rich} /></h3>;
    case "bulleted_list_item": return <li><Rich items={rich} />{children}</li>;
    case "numbered_list_item": return <li><Rich items={rich} />{children}</li>;
    case "quote": return <blockquote><Rich items={rich} /></blockquote>;
    case "callout": return <aside className="notion-callout"><Rich items={rich} />{children}</aside>;
    case "divider": return <hr />;
    case "code": return <pre><code><Rich items={rich} /></code></pre>;
    case "image": {
      const image = data as { type?: string; external?: { url: string }; file?: { url: string }; caption?: RichText[] };
      const src = image?.external?.url ?? image?.file?.url;
      const alt = personalizePublicContent(image.caption?.map((x) => x.plain_text).join("") || "Article illustration");
      return src ? <figure><Image unoptimized src={src} alt={alt} width={1200} height={675} /><figcaption><Rich items={image.caption} /></figcaption></figure> : null;
    }
    case "bookmark": {
      const url = String(data?.url ?? "");
      return url ? <p><a href={url} rel="noopener noreferrer">{url}</a></p> : null;
    }
    default: return children;
  }
}

export function NotionRenderer({ blocks }: { blocks: ContentBlock[] }) {
  const output: React.ReactNode[] = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const type = block.type;
      const items = [];
      while (blocks[index]?.type === type) {
        items.push(<Block key={blocks[index].id} block={blocks[index]} />);
        index++;
      }
      index--;
      output.push(type === "bulleted_list_item" ? <ul key={block.id}>{items}</ul> : <ol key={block.id}>{items}</ol>);
    } else output.push(<Block key={block.id} block={block} />);
  }
  return <div className="notion-content">{output}</div>;
}
