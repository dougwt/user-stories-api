# POST users

Insert a short description.

## Resource URL

<https://api.mycodebytes.com/v1/users>

## Method

`POST`

## Data Params

**Required**

- `email`
- `name`

## Success Response

**Code:** `201 Created`

**Content:**

```json
{
  "status": "success",
  "data": {
    "__v": 0,
    "_updatedAt": "2017-01-27T04:59:38.472Z",
    "_createdAt": "2017-01-27T04:59:38.472Z",
    "email": "test@example.com",
    "name": "Test",
    "_id": "588ad3bad0c97bdad5d079af"
  }
}
```

## Error Response:

**Code:** `400 Conflict`

**Content:**

```json
{
  "status": "error",
  "message": "Email is required."
}
```

OR

**Code:** `400 Conflict`

**Content:**

```json
{
  "status": "error",
  "message": "Name is required."
}
```

OR

**Code:** `400 Conflict`

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
