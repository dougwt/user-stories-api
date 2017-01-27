# GET users/:id

Insert a short description.

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
    "_id": "588ad409d0c97bdad5d079b1",
    "_updatedAt": "2017-01-27T05:00:57.576Z",
    "_createdAt": "2017-01-27T05:00:57.576Z",
    "email": "test@example123.com",
    "name": "Test",
    "__v": 0
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
