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
              const limit = req.query.limit ? parseInt(req.query.limit) + beginSlice : project.stories.length
              const endSlice = Math.min(limit, 100);
              const result = project.stories.sort(sortFunc).slice(beginSlice, endSlice);
              res.status(200).send(Response.success(result))
            } else {
              var err = new Error();
              err.status = 404;
              next(err);
            }
        }
      )
  },

  create(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const { _id, id, role, desire, benefit, author } = req.body;
    const project = req['project']

    const storyProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (role) { storyProps['role'] = role };
    if (desire) { storyProps['desire'] = desire };
    if (benefit) { storyProps['benefit'] = benefit };
    if (author) { storyProps['author'] = author };

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
        // TODO: replace hardcoded URI prefix
        return res.location('https://api.mycodebytes.com/v1/projects/'+ projectId).status(201).send(Response.success(project.stories));
      }
    });
  },

  update(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const storyId = req.params.storyId;
    const { _id, id, role, desire, benefit, author } = req.body;

    const storyProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (role) { storyProps['role'] = role };
    if (desire) { storyProps['desire'] = desire };
    if (benefit) { storyProps['benefit'] = benefit };
    if (author) { storyProps['author'] = author };

    const renamedProps = renameNestedProps(storyProps, 'stories.$.')

    Project.findOneAndUpdate(
      { "_id": projectId, "stories._id": storyId },
      { $set: renamedProps },
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
    const storyId = req.params.storyId;
    const project = req['project']
    const story = req['story']

    if (story === null) {
      var err = new Error();
      err.status = 404;
      next(err);
    }

    story.remove();
    project.save((err) => {
      if (err) {
        next(err);
      }
      return res.status(204).send(Response.success(project))
    });
  }

};
