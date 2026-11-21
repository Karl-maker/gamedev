# Architecture

The project follows narrow boundaries so each concern can change independently:

```text
UI form → validated API route → LeadRepository → Notion
                              ↘ LeadMailer → SMTP

Notion database → ContentRepository → server cache → semantic article pages

CONFIG_WEBSITE → validated config → pages, metadata, email, footer, experiments
```

- Single responsibility: validation, persistence, email, content mapping, experiment allocation, and presentation live in separate modules.
- Open/closed: add another `LeadRepository`, `LeadMailer`, or `ContentRepository` implementation without rewriting consumers.
- Interface segregation: each boundary contains only the methods its consumer needs.
- Dependency inversion: route/business data uses interfaces rather than importing Notion types.

For stricter runtime dependency injection, add a composition root that supplies repository and mailer factories to a lead service. The current route constructs production adapters after validation because the application has only one deployment adapter today.
