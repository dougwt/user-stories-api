# DELETE projects/:id

Permanently delete a Project.

## Resource URL

<https://api.mycodebytes.com/v1/projects/:id>

## Method

`DELETE`

## Request Headers

**Required**

*   `authorization`: *a valid JSON Web Token authenticating an existing user*

## Success Response

**Code:** `204 No Content`

## Error Response

**Code:** `401 Unauthorized`

**Content:**

```json
{
  "status": "error",
  "message": "You are unauthorized to make this request."
}
```

OR

**Code:** `403 Forbidden`

**Content:**

```json
{
  "status": "error",
  "message": "You do not have sufficient permissions to execute this operation."
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
