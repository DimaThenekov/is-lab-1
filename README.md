## Эндпоинты API

### Аутентификация

#### POST `/auth/register`
Регистрация нового пользователя.

**Тело запроса:**
```json
{
  "username": "testuser",
  "password": "securepassword123"
}
```

**Ответ:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

#### POST `/auth/login`
Аутентификация пользователя.

**Тело запроса:**
```json
{
  "username": "testuser",
  "password": "securepassword123"
}
```

**Ответ:**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

### Защищенные эндпоинты (требуют JWT токен)

#### GET `/api/data`
Получение всех постов.

**Заголовок:**
```
Authorization: Bearer <your_jwt_token>
```

**Ответ:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "First Post",
      "content": "This is the first post",
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### POST `/api/posts`
Создание нового поста.

**Заголовок:**
```
Authorization: Bearer <your_jwt_token>
```

**Тело запроса:**
```json
{
  "title": "My New Post",
  "content": "This is the content of my new post"
}
```

**Ответ:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 2,
    "title": "My New Post",
    "content": "This is the content of my new post",
    "userId": 1
  }
}
```

#### GET `/api/profile`
Получение профиля пользователя.

**Заголовок:**
```
Authorization: Bearer <your_jwt_token>
```

**Ответ:**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "createdAt": "2024-01-15T10:25:00.000Z"
  }
}
```

## Быстрый старт

### Установка и запуск

```bash
# Клонирование репозитория
git clone https://github.com/your-username/secure-express-api.git
cd secure-express-api

# Установка зависимостей
npm install

# Запуск в development режиме
npm run dev

# Запуск тестов
npm test

# Запуск security сканирования
npm run security-scan
```

### Примеры использования с curl

```bash
# Регистрация пользователя
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' \
  http://localhost:3000/auth/register

# Аутентификация
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' \
  http://localhost:3000/auth/login

# Получение данных (с токеном)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/data

# Создание поста
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Post","content":"Test content"}' \
  http://localhost:3000/api/posts
```

## Меры защиты

### Защита от SQL-инъекций

**Реализация:** Использование параметризованных запросов через SQLite3.

```javascript
// НЕПРАВИЛЬНО (уязвимо к SQLi)
db.run(`SELECT * FROM users WHERE username = '${username}'`);

// ПРАВИЛЬНО (защищено)
db.run('SELECT * FROM users WHERE username = ?', [username]);
```

### Защита от XSS атак

**Реализация:** Санитизация всех пользовательских входных данных.

```javascript
// Валидация и санитизация с express-validator
const postValidation = [
  body('title')
    .isLength({ min: 1 })
    .withMessage('Title is required')
    .trim()
    .escape(), // Экранирование HTML-символов
  body('content')
    .isLength({ min: 1 })
    .withMessage('Content is required')
    .trim()
    .escape()
];
```

### Защита аутентификации

**Хеширование паролей:** Использование bcryptjs с salt rounds = 10
```javascript
const hashedPassword = bcrypt.hashSync(password, 10);
```

**JWT токены:** 
- Срок действия: 1 час
- Secure secret key
- Middleware проверки на всех защищенных эндпоинтах

```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  // ... верификация токена
};
```

## CI/CD Pipeline

### Запускаемые проверки

1. **npm audit** - Проверка уязвимостей в зависимостях
3. **OWASP Dependency Check** - Анализ зависимостей
4. **ESLint security** - Статический анализ кода
5. **Jest tests** - Unit и интеграционные тесты

## Отчеты безопасности

### npm audit report

<img width="449" height="132" alt="image" src="https://github.com/user-attachments/assets/a5fde753-cbf6-467c-9f07-c6146cda4ac0" />

*Отчет показывает 0 уязвимостей высокого уровня критичности*

### OWASP Dependency Check

<img width="1070" height="1205" alt="image" src="https://github.com/user-attachments/assets/4a926390-e106-41c7-abe5-5abbc2250e4d" />

**OWASP Dependency Check обнаружил уязвимость**

### ESLint Security Analysis

<img width="586" height="985" alt="image" src="https://github.com/user-attachments/assets/073c890c-ee30-422f-b5a1-0cccfb73a89d" />

*ESLint с security plugin не обнаружил проблем безопасности*

### Test Results

<img width="832" height="332" alt="image" src="https://github.com/user-attachments/assets/fc554eac-7ee3-4e2d-bab6-2b5e92edf011" />

*Все тесты проходят успешно, включая security-тесты*
