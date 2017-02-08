# DELETE projects/:id

Permanently delete a Project.

## Resource URL

<https://api.mycodebytes.com/v1/projects/:id>

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
