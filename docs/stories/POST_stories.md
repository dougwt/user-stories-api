# POST stories

Create a new Story for a Project, specified by the id parameter..

## Resource URL

<https://api.mycodebytes.com/v1/projects/:id/stories>

## Method

`POST`

## Data Params

**Required**

*   `desire`
*   `benefit`

**Optional**

*   `role`
*   `author`

## Success Response

**Code:** `201 Created`

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
      "author": "588b0b53bcb4baeeeff2d1da",
    }
  ]
}
```

## Error Response:

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Desire is required."
}
```

OR

**Code:** `400 Bad Request`

**Content:**

```json
{
  "status": "error",
  "message": "Benefit is required."
}
```
