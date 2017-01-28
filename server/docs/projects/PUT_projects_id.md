# PUT projects/:id

Sets some values that Users are able to set under the “Settings” tab of their project page. Only the parameters specified will be updated.

## Resource URL

<https://api.mycodebytes.com/v1/projects/:id>

## Method

`PUT`

## Data Params

**Optional**

*   `name`
*   `slug`
*   `roles`
*   `stories`
*   `owner`

## Success Response

**Code:** `204 No Content`

## Error Response:

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Slug is invalid."
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

OR

**Code:** `409 Conflict`

**Content:**

```json
{
  "status": "error",
  "message": "Slug is in use."
}
```