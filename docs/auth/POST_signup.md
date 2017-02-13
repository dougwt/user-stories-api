# POST signin

Create a new User and return an authentication token.

## Resource URL

<https://api.mycodebytes.com/v1/signup>

## Method

`POST`

## Data Params

**Required**

*   `email`
*   `password`
*   `name`

## Success Response

**Code:** `201 Created`

**Content:**

```json
{
  "status": "success",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OGEwMDU3OTRkYjczMzE2NjcxYjdiMTAiLCJpYXQiOjE0ODY5NDE3NTIxNzh9.XIrVFzi0QiWT3DkIzkpeFFrEYRXsJVkXW9GCYrrvpYY"
}
```

## Error Response:

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Email is required."
}
```

OR

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Password is required."
}
```

OR

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Name is required."
}
```

OR

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Email is invalid."
}
```

OR

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Password is invalid."
}
```

OR

**Code:** `409 Conflict`

**Content:**

```json
{
  "status": "error",
  "message": "Email is in use."
}
```
