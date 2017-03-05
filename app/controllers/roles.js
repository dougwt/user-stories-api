import Project from '../models/project'
import Response from '../response'
import { URI_PREFIX } from '../config'

// TODO: refactor to utils
function renameNestedProps(roleProps, prefix) {
  // Source: http://stackoverflow.com/a/32452554
  function fix_key(key) { return prefix + key; }
  return Object.assign(
    {},
    ...Object.keys(roleProps).map(key => ({[fix_key(key)]: roleProps[key]}))
  )
}

module.exports = {

  // Find all project roles [GET /projects/:projectId/roles]
  findAll(req, res, next) {
    const projectId = req.params.projectId;

    // TODO: refactor to utils
    const sortFunc = function(a, b) {
      return b._createdAt - a._createdAt;
    };

    Project.findById(projectId)
      .then((project) => {
        // If the requested project was found...
        if (project) {
          // Determine which slice of the project's roles to return
          const beginSlice = req.query.skip ? parseInt(req.query.skip) : 0;
          const limit = req.query.limit ? parseInt(req.query.limit) + beginSlice : project.roles.length
          const endSlice = Math.min(limit, 100);
          const result = project.roles.sort(sortFunc).slice(beginSlice, endSlice);
          // Return the results along with a success response.
          res.status(200).send(Response.success(result))
        } else {
          // Otherwise, send a Not Found error response.
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => {
        return next(err)
      });
  },

  // Create a new project role [POST /projects/:projectId/roles]
  create(req, res, next) {
    const projectId = req.params.projectId;
    // Pull off only the specific props we expect the form to submit
    // and build our own props obj to protect from malicious clients.
    const project = req['requestedProject']
    const { _id, id, name } = req.body;
    const roleProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (name) {
      roleProps['name'] = name;
    } else {
      return res.status(400).send(Response.error('Name is required.'));
    };

    // Ensure a role with this same name
    // doesn't already exist within this project.
    if(project.roles.find(role => role.name === name)) {
      return res.status(409).send(Response.error('A role with this name already exists for this project.'));
    }

    // Create the new project role with our sanitized input.
    project.roles.push(roleProps);
    project.save((err) => {
      if (err) {
        if (err.errors['roles.0.name'] && err.errors['roles.0.name'].name && err.errors['roles.0.name'].name === 'ValidatorError' && err.errors['roles.0.name'].message === 'Path `name` is required.') {
          // TODO: I don't think I need this? At very least, 0 should not be hardcoded.
          res.status(400).send(Response.error('Name is required.'))
          next();
        } else {
         next(err);
        }
      } else {
        return res.location(`${URI_PREFIX}projects/${project._id}`).status(201).send(Response.success(project.roles));
      }
    });
  },

  // Update an existing project role [PUT /projects/:projectId/roles/:roleId]
  update(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    // Pull off only the specific props we expect the form to submit
    // and build our own props obj to protect from malicious clients.
    const { _id, id, name } = req.body;
    const roleProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (name) { roleProps['name'] = name };

    if (roleProps.hasOwnProperty('_id')) {
      res.status(403).send(Response.error('This action is forbidden.'));
      next();
      return;
    }

    // Update the project with our sanitized input.
    Project.findOneAndUpdate(
      { "_id": projectId, "roles._id": roleId },
      { $set: renameNestedProps(roleProps, 'roles.$.') },
      { runValidators: true, context: 'query' }
    )
      .then((project) => {
        // If the requested project was found...
        if (project) {
          // Return the project along with a success response.
          return res.location(`${URI_PREFIX}projects/${project._id}`).status(204).send(Response.success(project))
        }
        // Otherwise, send a Not Found error response.
        var err = new Error();
        err.status = 404;
        next(err);
      })
      .catch((err) => {
        next(err);
      });
  },

  // Delete an existing project role [DELETE /projects/:projectId/roles/:roleId]
  delete(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const project = req['requestedProject']
    const role = project.roles.id(roleId)

    // If the requested role was not found...
    if (role === null) {
      // Return a Not Found error response.
      var err = new Error();
      err.status = 404;
      next(err);
    }

    // Otherwise, attempt to delete the role.
    role.remove();
    project.save((err) => {
      if (err) { next(err); }
      // Send a success response with the project.
      return res.status(204).send(Response.success(project))
    });
  }

};
