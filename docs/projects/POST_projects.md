# POST projects

Create a new Project.

## Resource URL

<https://api.mycodebytes.com/v1/projects>

## Method

`POST`

## Request Headers

**Required**

*   `authorization`: *a valid JSON Web Token authenticating an existing user*

## Data Params

**Required**

*   `name`
*   `slug`

**Optional**

*   `roles`
*   `stories`
*   `owner`

## Success Response

**Code:** `201 Created`

**Content:**

```json
{
  "status": "success",
  "data": {
    "_id": "588bb00b627569fc58ed44b6",
    "_createdAt": "2017-01-27T20:39:39.225Z",
    "_updatedAt": "2017-01-27T20:39:39.225Z",
    "name": "My Example",
    "slug": "my-example-project",
    "roles": [],
    "stories": [],
    "owner": null
  }
}
```

## Error Response

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
  "message": "Slug is required."
}
```

OR

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Slug is invalid."
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

**Code:** `409 Conflict`

**Content:**

```json
{
  "status": "error",
  "message": "Slug is in use."
}
```
