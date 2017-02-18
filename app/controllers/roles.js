import Project from '../models/project';
import Response from '../response'

function renameNestedProps(roleProps, prefix) {
  // Source: http://stackoverflow.com/a/32452554
  function fix_key(key) { return prefix + key; }
  return Object.assign(
    {},
    ...Object.keys(roleProps).map(key => ({[fix_key(key)]: roleProps[key]}))
  )
}

module.exports = {

  findAll(req, res, next) {
    const projectId = req.params.projectId;

    const sortFunc = function(a, b) {
      return b._createdAt - a._createdAt;
    };

    Project.findById(projectId)
      .then((project) => {
            if (project) {
              const beginSlice = req.query.skip ? parseInt(req.query.skip) : 0;
              const limit = req.query.limit ? parseInt(req.query.limit) + beginSlice : project.roles.length
              const endSlice = Math.min(limit, 100);
              const result = project.roles.sort(sortFunc).slice(beginSlice, endSlice);
              res.status(200).send(Response.success(result))
            } else {
              var err = new Error();
              err.status = 404;
              next(err);
            }
        }
      )
      .catch((err) => {
        console.log('detected error:', err)
        return next(err)
      });
  },

  create(req, res, next) {
    const projectId = req.params.projectId;
    const project = req['requestedProject']
    const { _id, id, name } = req.body;

    const roleProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (name) { roleProps['name'] = name };

    project.roles.push(roleProps);
    project.save((err) => {
      if (err) {
        if (err.errors['roles.0.name'] && err.errors['roles.0.name'].name && err.errors['roles.0.name'].name === 'ValidatorError' && err.errors['roles.0.name'].message === 'Path `name` is required.') {
          res.status(400).send(Response.error('Name is required.'))
          next();
        } else {
         next(err);
        }
      } else {
        // TODO: replace hardcoded URI prefix
        return res.location('https://api.mycodebytes.com/v1/projects/'+ project.id).status(201).send(Response.success(project.roles));
      }
    });
  },

  update(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const { _id, id, name } = req.body;

    const roleProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (name) { roleProps['name'] = name };

    if (roleProps.hasOwnProperty('_id')) {
      res.status(403).send(Response.error('This action is forbidden.'));
      next();
      return;
    }

    Project.findOneAndUpdate(
      { "_id": projectId, "roles._id": roleId },
      { $set: renameNestedProps(roleProps, 'roles.$.') },
      { runValidators: true, context: 'query' }
    )
      .then((project) => {
        if (project) {
          // TODO: replace hardcoded URI prefix
          return res.location('https://api.mycodebytes.com/v1/projects/'+ project._id).status(204).send(Response.success(project))
        }
        var err = new Error();
        err.status = 404;
        next(err);
      })
      .catch((err) => {
        next(err);
      });
  },

  delete(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;

    const project = req['requestedProject']
    const role = project.roles.id(roleId)

    if (role === null) {
      var err = new Error();
      err.status = 404;
      next(err);
    }

    role.remove();
    project.save((err) => {
      if (err) {
        next(err);
      }
      return res.status(204).send(Response.success(project))
    });
  }

};
