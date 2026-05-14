const users = [
  { id: 1, username: "admin", role: "admin" },
  { id: 2, username: "manager", role: "manager" },
  { id: 3, username: "employee", role: "employee" },
  { id: 4, username: "guest", role: "guest" }
];

const files = [
  {
    id: 1,
    name: "public-info.pdf",
    ownerId: 1,
    accessLevel: "public"
  },
  {
    id: 2,
    name: "corporate-plan.docx",
    ownerId: 2,
    accessLevel: "corporate"
  },
  {
    id: 3,
    name: "confidential-report.xlsx",
    ownerId: 2,
    accessLevel: "confidential"
  },
  {
    id: 4,
    name: "employee-notes.txt",
    ownerId: 3,
    accessLevel: "corporate"
  }
];

module.exports = {
  users,
  files
};