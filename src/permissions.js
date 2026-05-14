const permissions = {
  admin: [
    "file:read:public",
    "file:read:corporate",
    "file:read:confidential",
    "file:create",
    "file:delete:any",
    "file:delete:own",
    "file:update-access"
  ],

  manager: [
    "file:read:public",
    "file:read:corporate",
    "file:read:confidential",
    "file:create",
    "file:delete:own",
    "file:update-access"
  ],

  employee: [
    "file:read:public",
    "file:read:corporate",
    "file:create",
    "file:delete:own"
  ],

  guest: [
    "file:read:public"
  ]
};

function hasPermission(role, permission) {
  return permissions[role]?.includes(permission);
}

module.exports = {
  permissions,
  hasPermission
};