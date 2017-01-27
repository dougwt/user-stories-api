# POST users

Create a new User.

## Resource URL

<https://api.mycodebytes.com/v1/users>

## Method

`POST`

## Data Params

**Required**

-   `email`
-   `name`

## Success Response

**Code:** `201 Created`

**Content:**

```json
{
  "status": "success",
  "data": {
    "_id": "588b0b53bcb4baeeeff2d1da",
    "_createdAt": "2017-01-27T08:56:52.013Z",
    "_updatedAt": "2017-01-27T08:56:52.013Z",
    "email": "grace@example.com",
    "name": "Grace Murray"
  }
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

**Code:** `409 Conflict`

**Content:**

```json
{
  "status": "error",
  "message": "Email is in use."
}
```
