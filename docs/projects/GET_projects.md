# GET projects

Returns a collection of the 100 most recently created Projects.

## Resource URL

<https://api.mycodebytes.com/v1/projects>

## Method

`GET`

## Request Headers

**Required**

*   `authorization`: *a valid JSON Web Token authenticating an existing user*

## URL Params

**Optional**

*   `skip=[integer]`
*   `limit=[integer]`

## Success Response

**Code:** `200 OK`

**Content:**

```json
{
  "status": "success",
  "data": [
    {
      "_id": "588bb00b627569fc58ed44b6",
      "_createdAt": "2017-01-27T20:39:39.225Z",
      "_updatedAt": "2017-01-27T20:39:39.225Z",
      "name": "My Example",
      "slug": "my-example-project",
      "roles": [],
      "stories": [],
      "owner": null
    },
    {
      "_id": "588bb00b627569fc58ed44b6",
      "_createdAt": "2017-01-27T20:39:39.225Z",
      "_updatedAt": "2017-01-27T20:39:39.225Z",
      "name": "Example 2",
      "slug": "example-2",
      "roles": [],
      "stories": [],
      "owner": null
    }
  ]
}
```

## Error Response

**Code:** `401 Unauthorized`

**Content:**

```json
{
  "status": "error",
  "message": "You are unauthorized to make this request."
}
```
