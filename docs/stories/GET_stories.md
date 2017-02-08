# GET stories

Returns a collection of the Project's 100 most recently created Stories.

## Resource URL

<https://api.mycodebytes.com/v1/projects/:id/stories>

## Method

`GET`

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
      "_id": "588cf7f004851d2f23c5e568",
      "_createdAt": "2017-01-28T19:58:40.641Z",
      "_updatedAt": "2017-01-28T19:58:40.641Z",
      "role": "588bbf5c93e45420b0046aa6",
      "desire": "find errors",
      "benefit": "they can be fixed",
      "author": "588b0b53bcb4baeeeff2d1da"
    },
    {
      "_id": "588cf90c04851d2f23c5e569",
      "_createdAt": "2017-01-28T20:03:24.641Z",
      "_updatedAt": "2017-01-28T20:03:24.641Z",
      "role": "588bbf5c93e45420b0046aa6",
      "desire": "load the webpage quickly",
      "benefit": "I can immediately find the information I need",
      "author": "588b0b53bcb4baeeeff2d1da"
    }
  ]
}
```
