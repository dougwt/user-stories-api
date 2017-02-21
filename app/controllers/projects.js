import Project from '../models/project'
import Response from '../response'
import { URI_PREFIX } from '../config'

module.exports = {

  // Find a single project [GET /projects/:projectId]
  findById(req, res, next) {
    const projectId = req.params.projectId;

    Project.findById(projectId)
      .then((project) => {
        // If the requested project was found...
        if (project) {
          // Return the project along with a success response.
          return res.status(200).send(Response.success(project))
        } else {
          // Otherwise, send a Not Found error response.
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => {
        next(err)
      });
  },

  // Find all visible projects [GET /projects]
  findAll(req, res, next) {
    // Unless the authenticated user has Admin privileges, filter
    // the query results to only display projects owned by the auth'ed user.
    const authenticatedUser = req.user;
    const query = authenticatedUser.admin ? {} : { owner: authenticatedUser._id }
    Project.find(query)
      .sort({ _createdAt: -1 })
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit ? req.query.limit : 100 + parseInt(req.query.skip)))
      .then((projects) => res.status(200).send(Response.success(projects)))
      .catch(next);
  },

  // Create a new project [POST /projects]
  create(req, res, next) {
    // Pull off only the specific props we expect the form to submit
    // and build our own props obj to protect from malicious clients.
    const { _id, id, name, slug, roles, stories, owner } = req.body;
    const projectProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (name) { projectProps['name'] = name };
    if (slug) { projectProps['slug'] = slug };
    if (roles) { projectProps['roles'] = roles };
    if (stories) { projectProps['stories'] = stories };
    if (owner) { projectProps['owner'] = owner };

    // Create the new project with our sanitized input.
    Project.create(projectProps)
      .then((project) => res.location(`${URI_PREFIX}projects/${project._id}`).status(201).send(Response.success(project)))
      .catch((err) => {
        if (err.errors.name && err.errors.name.name === 'ValidatorError' && err.errors.name.message === 'Path `name` is required.') {
          res.status(400).send(Response.error('Name is required.'))
          next();
        } else if (err.errors.slug && err.errors.slug.name === 'ValidatorError' && err.errors.slug.message === 'Path `slug` is required.') {
          res.status(400).send(Response.error('Slug is required.'))
          next();
        } else if (err.errors.slug && err.errors.slug.name === 'ValidatorError' && err.errors.slug.message.startsWith('Error, expected `slug` to be unique.')) {
          res.status(409).send(Response.error('Slug is in use.'))
          next();
        } else if (err.errors.slug && err.errors.slug.name === 'ValidatorError' && err.errors.slug.message.startsWith('Validator failed for path `slug`')) {
            res.status(400).send(Response.error('Slug is invalid.'))
            next();
        } else {
          next(err);
        }
      });
  },

  // Update an existing project [PUT /projects/:projectId]
  update(req, res, next) {
    const projectId = req.params.projectId;
    // Pull off only the specific props we expect the form to submit
    // and build our own props obj to protect from malicious clients.
    const { _id, id, name, slug, roles, stories, owner } = req.body;
    const projectProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (name) { projectProps['name'] = name };
    if (slug) { projectProps['slug'] = slug };
    if (roles) { projectProps['roles'] = roles };
    if (stories) { projectProps['stories'] = stories };
    if (owner) { projectProps['owner'] = owner };

    // Update the project with our sanitized input.
    Project.findByIdAndUpdate(projectId, projectProps, { runValidators: true, context: 'query' })
      .then((project) => {
        // If the requested project was found...
        if (project) {
          // Return the project along with a success response.
          return res.location(`${URI_PREFIX}projects/${project._id}`).status(204).send(Response.success(project))
        } else {
          // Otherwise, send a Not Found error response.
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => {
        if(err.codeName === 'ImmutableField' || (err.name === 'MongoError' && err.message === 'exception: Mod on _id not allowed')) {
          res.status(403).send(Response.error('This action is forbidden.'));
          next();
        } else if (err.errors.slug && err.errors.slug.name === 'ValidatorError' && err.errors.slug.message.startsWith('Error, expected `slug` to be unique.')) {
          res.status(409).send(Response.error('Slug is in use.'))
          next();
        } else if (err.errors && err.errors.slug && err.errors.slug.name === 'ValidatorError' && err.errors.slug.message.startsWith('Validator failed for path `slug`')) {
          res.status(400).send(Response.error('Slug is invalid.'));
          next();
        }
        next(err);
      });
  },

  // Delete an existing project [DELETE /projects/:projectId]
  delete(req, res, next) {
    const projectId = req.params.projectId;

    Project.findByIdAndRemove(projectId)
      .then((project) => {
        // If the requested project was found...
        if (project) {
          // Send a success response with the project.
          return res.status(204).send(Response.success(project))
        } else {
          // Otherwise, return a Not Found error response.
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
  }

};
