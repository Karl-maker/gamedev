export type RichText = {
  plain_text: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
};

export type ContentBlock = {
  id: string;
  type: string;
  [key: string]: unknown;
  children?: ContentBlock[];
};

export type ContentEntry = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  cover?: string;
  tags: string[];
  type: "blog" | "news";
  blocks?: ContentBlock[];
};

export interface ContentRepository {
  list(type: "blog" | "news", limit?: number): Promise<ContentEntry[]>;
  findBySlug(type: "blog" | "news", slug: string): Promise<ContentEntry | null>;
}
