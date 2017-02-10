# user-stories-api

[![Build Status](https://travis-ci.org/dougwt/user-stories-api.svg?branch=develop)](https://travis-ci.org/dougwt/user-stories-api) [![Coverage Status](https://coveralls.io/repos/github/dougwt/user-stories-api/badge.svg?branch=develop)](https://coveralls.io/github/dougwt/user-stories-api)

A Node.js+Express API server for curating project user stories.

This source repo contains the NodeJS+Express API server powering [MyUserStories.com](https://myuserstories.com).

## Getting Started

### Prerequisites

If you would like to run a local instance of this app in developer mode, the easiest method is using [npm](https://docs.npmjs.com/getting-started/installing-node), the package manager included with Node.js.

1. Install [Node.js](https://nodejs.org)

2. Install [MongoDB](https://mongodb.com)

3. Install the required JavaScript dependencies using npm:

  `$ npm install`

### Running the app

To run the api server:

  `$ npm start`

(Note: Requires mongodb to be running locally by default. MongoDB connection settings may be modified in [app/config.js](app/config.js).)

### Running the tests

To run the included tests:

  `$ npm test`

(Note: Requires mongodb to be running locally by default. MongoDB connection settings may be modified in [app/config.js](app/config.js).)

## API Documentation

### Users

*   [GET users](docs/users/GET_users.md)
*   [POST users](docs/users/POST_users.md)
*   [GET users/:id](docs/users/GET_users_id.md)
*   [PUT users/:id](docs/users/PUT_users_id.md)
*   [DELETE users/:id](docs/users/DELETE_users_id.md)

### Projects

*   [GET projects](docs/projects/GET_projects.md)
*   [POST projects](docs/projects/POST_projects.md)
*   [GET projects/:id](docs/projects/GET_projects_id.md)
*   [PUT projects/:id](docs/projects/PUT_projects_id.md)
*   [DELETE projects/:id](docs/projects/DELETE_projects_id.md)

### Roles

*   [GET projects/:id/roles](docs/roles/GET_roles.md)
*   [POST projects/:id/roles](docs/roles/POST_roles.md)
*   [PUT projects/:id/roles/:id](docs/roles/PUT_roles_id.md)
*   [DELETE projects/:id/roles/:id](docs/roles/DELETE_roles_id.md)

### Stories

*   [GET projects/:id/stories](docs/stories/GET_stories.md)
*   [POST projects/:id/stories](docs/stories/POST_stories.md)
*   [PUT projects/:id/stories/:id](docs/stories/PUT_stories_id.md)
*   [DELETE projects/:id/stories/:id](docs/stories/DELETE_stories_id.md)

## License

TBD

## Acknowledgements

TBD
