# POST roles

Create a new Role for a Project, specified by the id parameter..

## Resource URL

<https://api.mycodebytes.com/v1/projects/:id/roles>

## Method

`POST`

## Request Headers

**Required**

*   `authorization`: *a valid JSON Web Token authenticating an existing user*

## Data Params

**Required**

*   `name`

## Success Response

**Code:** `201 Created`

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
    }
  ]
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

**Code:** `401 Unauthorized`

**Content:**

```json
{
  "status": "error",
  "message": "You are unauthorized to make this request."
}
```
