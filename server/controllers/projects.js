import Project from '../models/project';
import Response from '../response'

module.exports = {

  findById(req, res, next) {
    const projectId = req.params.projectId;

  },

  findAll(req, res, next) {
    Project.find({})
      .then((projects) => res.status(200).send(Response.success(projects)))
      .catch(next);
  },

  create(req, res, next) {
    const projectProps = req.body;

    Project.create(projectProps)
      // TODO: replace hardcoded URI prefix
      .then((project) => res.location('https://api.mycodebytes.com/v1/projects/'+ project.id).status(201).send(Response.success(project)))
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

  update(req, res, next) {
    const projectId = req.params.projectId;
    const projectProps = req.body;

  },

  delete(req, res, next) {
    const projectId = req.params.projectId;

  }

};
