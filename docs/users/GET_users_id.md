# GET users/:id

Returns a single User, specified by the id parameter.

## Resource URL

<https://api.mycodebytes.com/v1/users/:id>

## Method

`GET`

## Success Response

**Code:** `200 OK`

**Content:**

```json
{
  "status": "success",
  "data": {
    "_id": "588b0b53bcb4baeeeff2d1da",
    "_createdAt": "2017-01-27T08:56:52.013Z",
    "_updatedAt": "2017-01-27T08:56:52.013Z",
    "email": "grace@example.com",
    "name": "Grace Murray"
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