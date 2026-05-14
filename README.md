# Практична робота 3: RBAC та безпека авторизації

## Варіант

Варіант 3: Система управління файлами.

## Мета роботи

Реалізувати API з рольовою моделлю доступу RBAC, перевіркою прав користувачів, захистом від IDOR та privilege escalation, а також автоматизованими тестами.

## Опис проєкту

У проєкті реалізовано API для керування файлами. Реальні файли не зберігаються, використовується тільки список метаданих:

- `id` — ідентифікатор файлу;
- `name` — назва файлу;
- `ownerId` — власник файлу;
- `accessLevel` — рівень доступу.

## Ролі

У системі є 4 ролі:

- `admin`
- `manager`
- `employee`
- `guest`

## Рівні доступу

Файли можуть мати рівні:

- `public`
- `corporate`
- `confidential`

## Матриця дозволів

| Операція | admin | manager | employee | guest |
|---|---|---|---|---|
| Читати public | Так | Так | Так | Так |
| Читати corporate | Так | Так | Так | Ні |
| Читати confidential | Так | Так | Ні | Ні |
| Створити файл | Так | Так | Так | Ні |
| Видалити свій файл | Так | Так | Так | Ні |
| Видалити будь-який файл | Так | Ні | Ні | Ні |
| Змінити рівень доступу | Так | Так | Ні | Ні |

## Реалізовано

- автентифікація через заголовок `x-user-id`;
- middleware `authenticate`;
- middleware `authorize`;
- перевірка ролей і дозволів;
- CRUD-операції для метаданих файлів;
- захист від IDOR;
- захист від privilege escalation;
- автоматизовані тести Jest + Supertest.

## Основні API endpoints

```http
GET /
```

Перевірка роботи API.

```http
GET /me
Header: x-user-id
```

Отримати поточного користувача.

```http
GET /files/:id
Header: x-user-id
```

Отримати файл за ID.

```http
POST /files
Header: x-user-id
Body:
{
  "name": "file.txt",
  "accessLevel": "corporate"
}
```

Створити файл.

```http
DELETE /files/:id
Header: x-user-id
```

Видалити файл.

```http
PATCH /files/:id/access
Header: x-user-id
Body:
{
  "accessLevel": "confidential"
}
```

Змінити рівень доступу файлу.

```http
PATCH /users/:id/role
```

Спроба зміни ролі. Повертає `403`, щоб запобігти privilege escalation.

## Захист від IDOR

IDOR-захист реалізовано під час видалення файлів. Якщо користувач може видаляти тільки власні файли, система перевіряє `ownerId`. Якщо файл належить іншому користувачу, сервер повертає `403 Forbidden`.

## Захист від privilege escalation

Користувач не може самостійно змінити свою роль на `admin`. Запит на зміну ролі повертає `403`.

## Запуск проєкту

Встановити залежності:

```bash
npm install
```

Запустити сервер:

```bash
npm start
```

Адреса сервера:

```text
http://localhost:3000
```

## Запуск тестів

```bash
npm test
```

Результат тестування:

```text
Test Suites: 1 passed
Tests: 14 passed
```

## Структура проєкту

```text
rbac-security-practice/
├── src/
│   ├── app.js
│   ├── auth.js
│   ├── data.js
│   └── permissions.js
├── tests/
│   └── auth.test.js
├── ai-session.md
├── README.md
├── package.json
├── package-lock.json
└── .gitignore
```
