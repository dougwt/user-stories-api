# DELETE users/:id

Permanently delete a User.

## Resource URL

<https://api.mycodebytes.com/v1/users/:id>

## Method

`DELETE`

## Success Response

**Code:** `204 No Content`

## Error Response:

**Code:** `404 Not Found`

**Content:**

```json
{
  "status": "error",
  "message": "The requested resource does not exist."
}
```
