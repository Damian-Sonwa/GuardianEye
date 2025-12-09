# API Documentation

## Base URL

- Development: `http://localhost:3001`
- Production: `https://api.yourdomain.com`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER"
  }
}
```

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGci...",
  "user": { ... }
}
```

### Reports

#### POST /reports
Create a new incident report.

**Request:** `multipart/form-data`
- `description` (string, required)
- `location` (string, JSON: `{"lat": 0, "lng": 0}`)
- `media` (file, optional)
- `anonymous` (string, "true" or "false")

**Response:**
```json
{
  "id": "report-id",
  "description": "Incident description",
  "location": {"lat": 0, "lng": 0},
  "mediaUrl": "/uploads/file.jpg",
  "riskLevel": "medium",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### GET /reports
Get all reports (officers only).

**Query Parameters:**
- `status` (string, optional): Filter by risk level

**Response:**
```json
[
  {
    "id": "report-id",
    "description": "...",
    "location": {...},
    "user": {...},
    "createdAt": "..."
  }
]
```

### Panic

#### POST /panic
Send a panic alert.

**Request:**
```json
{
  "location": {"lat": 0, "lng": 0},
  "userId": "user-id"
}
```

**Response:**
```json
{
  "id": "panic-id",
  "location": {"lat": 0, "lng": 0},
  "smsSent": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### AI Services

#### POST /ai/face-match
Match a face against the suspect database.

**Request:** `multipart/form-data`
- `image` (file, required)

**Response:**
```json
{
  "matches": [
    {
      "suspect_id": "suspect-id",
      "confidence": 0.85,
      "distance": 0.15
    }
  ],
  "faces_detected": 1
}
```

#### POST /ai/weapons
Detect weapons in an image.

**Request:** `multipart/form-data`
- `image` (file, required)

**Response:**
```json
{
  "detections": [
    {
      "label": "knife",
      "confidence": 0.92,
      "bbox": {"x1": 100, "y1": 100, "x2": 200, "y2": 200},
      "is_weapon": true
    }
  ],
  "weapons_detected": 1
}
```

#### POST /ai/classify-threat
Classify incident threat level.

**Request:**
```json
{
  "description": "Suspicious activity reported",
  "location": {"lat": 0, "lng": 0}
}
```

**Response:**
```json
{
  "riskLevel": "medium",
  "confidence": 0.6
}
```

### Cases

#### POST /cases
Create a new case (officers only).

**Request:**
```json
{
  "title": "Case Title",
  "description": "Case description",
  "status": "open",
  "priority": "high",
  "assignedTo": "officer-id"
}
```

**Response:**
```json
{
  "id": "case-id",
  "title": "Case Title",
  "status": "open",
  "priority": "high",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### GET /cases
Get all cases (officers only).

**Response:**
```json
[
  {
    "id": "case-id",
    "title": "Case Title",
    "status": "open",
    "officer": {...},
    "reports": [...]
  }
]
```

### Community

#### GET /community/alerts
Get community alerts.

**Response:**
```json
[
  {
    "id": "alert-id",
    "message": "Reported incident near...",
    "location": {"lat": 0, "lng": 0},
    "time": "2024-01-01T00:00:00Z",
    "riskLevel": "high"
  }
]
```

#### GET /community/safe-routes
Get safe route suggestions.

**Request:**
```json
{
  "origin": {"lat": 0, "lng": 0},
  "destination": {"lat": 0, "lng": 0}
}
```

**Response:**
```json
{
  "routes": [
    {
      "distance": 5000,
      "duration": 600,
      "waypoints": [...]
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- AI endpoints: 10 requests/minute

## Webhooks

Coming soon: Webhook support for real-time notifications.

