const express = require("express");
const { users, files } = require("./data");
const {
  authenticate,
  authorize,
  authorizeFileRead,
  authorizeFileDelete
} = require("./auth");

const app = express();

app.use(express.json());

// Головна перевірка, що API працює
app.get("/", (req, res) => {
  res.json({
    message: "RBAC File Management API is running"
  });
});

// Перегляд поточного користувача
app.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});

// Перегляд списку користувачів
app.get("/users", authenticate, (req, res) => {
  res.json(users);
});

// Перегляд конкретного файлу з перевіркою рівня доступу
app.get("/files/:id", authenticate, authorizeFileRead, (req, res) => {
  res.json(req.file);
});

// Створення нового файлу
app.post("/files", authenticate, authorize("file:create"), (req, res) => {
  const { name, accessLevel } = req.body;

  if (!name || !accessLevel) {
    return res.status(400).json({
      message: "File name and access level are required"
    });
  }

  const allowedLevels = ["public", "corporate", "confidential"];

  if (!allowedLevels.includes(accessLevel)) {
    return res.status(400).json({
      message: "Invalid access level"
    });
  }

  const newFile = {
    id: files.length + 1,
    name,
    ownerId: req.user.id,
    accessLevel
  };

  files.push(newFile);

  res.status(201).json(newFile);
});

// Видалення файлу з IDOR-захистом
app.delete("/files/:id", authenticate, authorizeFileDelete, (req, res) => {
  const index = files.findIndex((f) => f.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      message: "File not found"
    });
  }

  const deletedFile = files.splice(index, 1)[0];

  res.json({
    message: "File deleted",
    file: deletedFile
  });
});

// Зміна рівня доступу файлу
app.patch(
  "/files/:id/access",
  authenticate,
  authorize("file:update-access"),
  (req, res) => {
    const file = files.find((f) => f.id === Number(req.params.id));

    if (!file) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    const { accessLevel } = req.body;
    const allowedLevels = ["public", "corporate", "confidential"];

    if (!allowedLevels.includes(accessLevel)) {
      return res.status(400).json({
        message: "Invalid access level"
      });
    }

    file.accessLevel = accessLevel;

    res.json({
      message: "Access level updated",
      file
    });
  }
);

// Захист від privilege escalation
app.patch("/users/:id/role", authenticate, (req, res) => {
  return res.status(403).json({
    message: "Changing roles is forbidden to prevent privilege escalation"
  });
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
  });
}

module.exports = app;