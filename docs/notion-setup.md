# Notion setup

## 1. Create and connect an integration

1. Create an internal integration in Notion and copy its token into `NOTION_TOKEN`.
2. Open each database, choose **Connections**, and grant the integration access.
3. Set the database IDs in `.env.local`. The supplied lead and blog IDs are already present in `.env.example`; the token is intentionally blank.
4. Never prefix a Notion secret with `NEXT_PUBLIC_`.

Official reference: `https://developers.notion.com/docs/create-a-notion-integration`

## 2. Lead database schema

The lead database must contain these exact properties:

| Property | Notion type |
| --- | --- |
| Name | Title |
| Company | Text |
| Email | Email |
| Phone | Phone |
| Preferred Contact | Select |
| Contact Details | Text |
| Company Size | Select |
| Industry | Select |
| Country | Select |
| Product Interest | Text |
| Message | Text |
| A/B Assignments | Text |
| Target | Text |
| Target Config | Text |
| Source URL | URL |
| Submitted At | Date |
| Consent | Checkbox |

Notion creates select options sent by the integration if permissions allow. If your workspace restricts that, add the UI choices from `src/data/options.ts` manually.

After placing the token and database ID in `.env.local`, create/update these columns automatically:

```bash
npm run notion:setup
```

`Contact Details` stores the exact email, complete phone number, and preferred contact method submitted at that moment. `Target Config` stores the server-side deployment/campaign configuration used at submission time.

`LeadRepository` is the application boundary. `NotionLeadRepository` is one implementation, so another CRM can be added without changing validation, UI, or the route contract (dependency inversion and single responsibility).

## 3. Blog/news schema

Create a database with:

| Property | Type | Notes |
| --- | --- | --- |
| Title | Title | Required |
| Slug | Text | Recommended; generated from title when blank |
| Excerpt | Text | Search/social description |
| Published At | Date | Required for publishing and sorting |
| Status | Select | Use `Published`; drafts are excluded |
| Tags | Multi-select | Optional |
| Cover | URL | Optional alternative to a page cover |

Page blocks support paragraphs, headings, lists, quotes, callouts, dividers, code, images, and bookmarks. Use a separate database ID for news or leave `NOTION_NEWS_DATABASE_ID` blank.

Content is fetched server-side, cached for five minutes, and rendered as semantic HTML. Browser clients receive the generated page, not the Notion token.

## 4. Immediate revalidation

Configure a webhook to `POST /api/revalidate` with the raw-body HMAC-SHA256 in `x-webhook-signature`, using `NOTION_WEBHOOK_SECRET`. If your automation tool cannot sign requests, use the five-minute cache rather than exposing an unauthenticated revalidation endpoint.

## Troubleshooting

- 401: token is missing/invalid.
- 404: integration is not connected to the database, or ID is wrong.
- 400: a property name/type differs from the lead schema.
- Empty publishing page: confirm `Published At` is set and `Status` is exactly `Published`.
