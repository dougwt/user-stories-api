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

  // Find all project stories [GET /projects/:projectId/stories]
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
          // Determine which slice of the project's stories to return
          const beginSlice = req.query.skip ? parseInt(req.query.skip) : 0;
          const limit = req.query.limit ? parseInt(req.query.limit) + beginSlice : project.stories.length
          const endSlice = Math.min(limit, 100);
          const result = project.stories.sort(sortFunc).slice(beginSlice, endSlice);
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

  // Create a new project story [POST /projects/:projectId/stories]
  create(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    // Pull off only the specific props we expect the form to submit
    // and build our own props obj to protect from malicious clients.
    const { _id, id, role, desire, benefit, author } = req.body;
    const project = req['requestedProject']
    const storyProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (role) { storyProps['role'] = role };
    if (desire) { storyProps['desire'] = desire };
    if (benefit) { storyProps['benefit'] = benefit };
    if (author) { storyProps['author'] = author };

    // Create the new project story with our sanitized input.
    project.stories.push(storyProps);
    project.save((err) => {
      if (err) {
        if (err.errors['stories.0.desire'] && err.errors['stories.0.desire'].name && err.errors['stories.0.desire'].name === 'ValidatorError' && err.errors['stories.0.desire'].message === 'Path `desire` is required.') {
          res.status(400).send(Response.error('Desire is required.'))
          next();
        } else if (err.errors['stories.0.benefit'] && err.errors['stories.0.benefit'].name && err.errors['stories.0.benefit'].name === 'ValidatorError' && err.errors['stories.0.benefit'].message === 'Path `benefit` is required.') {
          res.status(400).send(Response.error('Benefit is required.'))
          next();
        } else {
          console.log('detected error:', err)
          next(err);
        }
      } else {
        return res.location(`${URI_PREFIX}projects/${projectId}`).status(201).send(Response.success(project.stories));
      }
    });
  },

  // Update an existing project story [PUT /projects/:projectId/stories/:storyId]
  update(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const storyId = req.params.storyId;
    // Pull off only the specific props we expect the form to submit
    // and build our own props obj to protect from malicious clients.
    const { _id, id, role, desire, benefit, author } = req.body;
    const storyProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (role) { storyProps['role'] = role };
    if (desire) { storyProps['desire'] = desire };
    if (benefit) { storyProps['benefit'] = benefit };
    if (author) { storyProps['author'] = author };

    // Rename each prop to account for MongoDB's nested document structure.
    const renamedProps = renameNestedProps(storyProps, 'stories.$.')

    // Update the project with our sanitized input.
    Project.findOneAndUpdate(
      { "_id": projectId, "stories._id": storyId },
      { $set: renamedProps },
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

  // Delete an existing project story [DELETE /projects/:projectId/stories/:storyId]
  delete(req, res, next) {
    const projectId = req.params.projectId;
    const storyId = req.params.storyId;
    const project = req['requestedProject']
    const story = req['requestedStory']

    // If the requested role was not found...
    if (story === null) {
      // Return a Not Found error response.
      var err = new Error();
      err.status = 404;
      next(err);
    }

    // Otherwise, attempt to delete the role.
    story.remove();
    project.save((err) => {
      if (err) { next(err); }
      // Send a success response with the project.
      return res.status(204).send(Response.success(project))
    });
  }

};
