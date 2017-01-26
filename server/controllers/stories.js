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

    Project.findById(projectId)
      .then((project) => res.status(200).send(Response.success(project.stories)))
      .catch(next);
  },

  create(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const storyProps = req.body;
    const project = req['project']

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
         next(err);
        }
      } else {
        return res.location('https://api.mycodebytes.com/v1/projects/'+ projectId).status(201).send(Response.success(project.stories));
      }
    });
  },

  update(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const storyId = req.params.storyId;
    const storyProps = req.body;

    // // if (roleProps.hasOwnProperty('_id')) {
    // //   res.status(403).send(Response.error('This action is forbidden.'));
    // //   next();
    // //   return;
    // // }
    //
    // // TODO: replace hardcoded URI prefix
    // const renamedProps = renameNestedProps(storyProps, 'roles.$.stories.')
    // console.log(renamedProps)
    //
    // Project.findOneAndUpdate(
    //   { "_id": projectId, "roles._id": roleId, "roles.stories._id": storyId },
    //   { $set: renamedProps },
    //   { runValidators: true, context: 'query' }
    // )
    //   .then((project) => {
    //     console.log(project.roles[0])
    //     if (project) {
    //       return res.location('https://api.mycodebytes.com/v1/projects/'+ project._id).status(204).send(Response.success(project))
    //     }
    //     // var err = new Error();
    //     // err.status = 404;
    //     // next(err);
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     next(err);
    //   });
  },

  delete(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const project = req['project']
    const role = project.roles.id(roleId)

    // if (role === null) {
    //   var err = new Error();
    //   err.status = 404;
    //   next(err);
    // }
    //
    // role.remove();
    // project.save((err) => {
    //   if (err) {
    //     next(err);
    //   }
    //   return res.status(204).send(Response.success(project))
    // });
  }

};
