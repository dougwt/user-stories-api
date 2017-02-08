# GET projects/:id

Returns a single Project, specified by the id parameter.

## Resource URL

<https://api.mycodebytes.com/v1/projects/:id>

## Method

`GET`

## Success Response

**Code:** `200 OK`

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

## Error Response:

**Code:** 404 Not Found

**Content:**

```json
{
  "status": "error",
  "message": "The requested resource does not exist."
}
```