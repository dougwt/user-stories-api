# POST signin

Return an authentication token for an existing User.

## Resource URL

<https://api.mycodebytes.com/v1/signin>

## Method

`POST`

## Data Params

**Required**

*   `email`
*   `password`

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

**Code:** `401 Unauthorized`

**Content:**

```json
{
  "status": "error",
  "message": "You are unauthorized to make this request."
}
```
