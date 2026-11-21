const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_LEAD_DATABASE_ID;

if (!token || !databaseId) {
  console.error("Set NOTION_TOKEN and NOTION_LEAD_DATABASE_ID in .env.local first.");
  process.exit(1);
}

const properties = {
  Company: { rich_text: {} },
  Email: { email: {} },
  Phone: { phone_number: {} },
  "Preferred Contact": { select: { options: [
    { name: "Email", color: "blue" },
    { name: "Phone", color: "green" },
    { name: "Either", color: "purple" }
  ] } },
  "Contact Details": { rich_text: {} },
  "Company Size": { select: {} },
  Industry: { select: {} },
  Country: { select: {} },
  "Product Interest": { rich_text: {} },
  Message: { rich_text: {} },
  "A/B Assignments": { rich_text: {} },
  Target: { rich_text: {} },
  "Target Config": { rich_text: {} },
  "Source URL": { url: {} },
  "Submitted At": { date: {} },
  Consent: { checkbox: {} }
};

const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ properties })
});

if (!response.ok) {
  console.error(`Notion schema setup failed (${response.status}):`, await response.text());
  process.exit(1);
}

console.log("Notion lead database properties are ready.");
