const { users, files } = require("./data");
const { hasPermission } = require("./permissions");

function authenticate(req, res, next) {
  const userId = Number(req.header("x-user-id"));

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: user id is required" });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized: user not found" });
  }

  req.user = user;
  next();
}

function authorize(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
}

function authorizeFileRead(req, res, next) {
  const file = files.find((f) => f.id === Number(req.params.id));

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  req.file = file;

  const permission = `file:read:${file.accessLevel}`;

  if (!hasPermission(req.user.role, permission)) {
    return res.status(403).json({ message: "Forbidden: cannot read this file" });
  }

  next();
}

function authorizeFileDelete(req, res, next) {
  const file = files.find((f) => f.id === Number(req.params.id));

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  req.file = file;

  if (hasPermission(req.user.role, "file:delete:any")) {
    return next();
  }

  if (hasPermission(req.user.role, "file:delete:own") && file.ownerId === req.user.id) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: cannot delete this file" });
}

module.exports = {
  authenticate,
  authorize,
  authorizeFileRead,
  authorizeFileDelete
};