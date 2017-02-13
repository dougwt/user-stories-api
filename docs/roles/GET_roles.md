# GET roles

Returns a collection of the Project's 100 most recently created Roles.

## Resource URL

<https://api.mycodebytes.com/v1/projects/:id/roles>

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
      "_id": "588bbf5c93e45420b0046aa6",
      "_createdAt": "2017-01-27T21:45:00.421Z",
      "_updatedAt": "2017-01-27T21:45:00.421Z",
      "name": "User"
    },
    {
      "_id": "588bbfe093e45420b0046aa7",
      "_createdAt": "2017-01-27T21:47:12.221Z",
      "_updatedAt": "2017-01-27T21:47:12.221Z",
      "name": "Developer"
    }
  ]
}
```
