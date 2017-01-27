# GET users

Returns a list of existing users.

## Resource URL

<https://api.mycodebytes.com/v1/users>

## Method

`GET`

## Success Response

**Code:** `200 OK`

**Content:**

```json
{
  "status": "success",
  "data": [
    {
      "_id": "587d6b137a3d2b1605071259",
      "updatedAt": "2017-01-17T00:53:39.634Z",
      "createdAt": "2017-01-17T00:53:39.634Z",
      "email": "test@test.com",
      "name": "Test",
      "creation_date": "2017-01-17T00:53:39.606Z",
      "__v": 0
    }
  ]
}
```
