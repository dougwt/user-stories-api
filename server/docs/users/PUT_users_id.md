# PUT users/:id

Update a single User, specified by the id parameter. Only the parameters specified will be updated.

## Resource URL

<https://api.mycodebytes.com/v1/users/:id>

## Method

`PUT`

## Data Params

**Optional**

*   `email`
*   `name`

## Success Response

**Code:** `204 No Content`

## Error Response:

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Email is invalid."
}

```

OR

**Code:** `403 Forbidden`

**Content:**

```json
{
  "status": "error",
  "message": "This action is forbidden."
}
```

OR

**Code:** `404 Not Found`

**Content:**

```json
{
  "status": "error",
  "message": "The requested resource does not exist."
}
```
