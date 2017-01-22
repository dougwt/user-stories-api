import Project from '../models/project';
import Response from '../response'

module.exports = {

  findById(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;

  },

  findAll(req, res, next) {
    const projectId = req.params.projectId;

    Project.findById(projectId)
      .then((projects) => res.status(200).send(Response.success(projects.roles)))
      .catch(next);
  },

  create(req, res, next) {
    const projectId = req.params.projectId;
    const roleProps = req.body;

    Project.findById(projectId)
      // TODO: replace hardcoded URI prefix
      .then((project) => {
        project.roles.push(roleProps);
        project.save((err) => {
          if (err) {
            if (err.errors['roles.0.name'] && err.errors['roles.0.name'].name && err.errors['roles.0.name'].name === 'ValidatorError' && err.errors['roles.0.name'].message === 'Path `name` is required.') {
              res.status(400).send(Response.error('Name is required.'))
              next();
            // } else if (err.errors.slug && err.errors.slug.name === 'ValidatorError' && err.errors.slug.message === 'Path `slug` is required.') {
            //   res.status(400).send(Response.error('Slug is required.'))
            //   next();
            // } else if (err.errors.slug && err.errors.slug.name === 'ValidatorError' && err.errors.slug.message.startsWith('Error, expected `slug` to be unique.')) {
            //   res.status(409).send(Response.error('Slug is in use.'))
            //   next();
            // } else if (err.errors.slug && err.errors.slug.name === 'ValidatorError' && err.errors.slug.message.startsWith('Validator failed for path `slug`')) {
            //     res.status(400).send(Response.error('Slug is invalid.'))
            //     next();
            // } else {
            //  next(err);
            }
          } else {
            return res.location('https://api.mycodebytes.com/v1/projects/'+ project.id).status(201).send(Response.success(project.roles));
          }
        });
      })
      // .catch((err) => {
      //   console.log('2', err)
      //
      // });
  },

  update(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;
    const roleProps = req.body;

  },

  delete(req, res, next) {
    const projectId = req.params.projectId;
    const roleId = req.params.roleId;

  }

};
