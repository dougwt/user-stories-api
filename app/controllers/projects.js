import Project from '../models/project';
import Response from '../response'

module.exports = {

  findById(req, res, next) {
    const projectId = req.params.projectId;

    Project.findById(projectId)
      .then((project) => {
        if (project) {
          return res.status(200).send(Response.success(project))
        } else {
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
      .catch((err) => {
        next(err)
      });
  },

  findAll(req, res, next) {
    Project.find({})
      .sort({ _createdAt: -1 })
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit ? req.query.limit : 100 + parseInt(req.query.skip)))
      .then((projects) => res.status(200).send(Response.success(projects)))
      .catch(next);
  },

  create(req, res, next) {
    const { _id, id, name, slug, roles, stories, owner } = req.body;

    const projectProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (name) { projectProps['name'] = name };
    if (slug) { projectProps['slug'] = slug };
    if (roles) { projectProps['roles'] = roles };
    if (stories) { projectProps['stories'] = stories };
    if (owner) { projectProps['owner'] = owner };

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
    const { _id, id, name, slug, roles, stories, owner } = req.body;

    const projectProps = {};
    if (_id || id) { return res.status(403).send(Response.error('This action is forbidden.')); }
    if (name) { projectProps['name'] = name };
    if (slug) { projectProps['slug'] = slug };
    if (roles) { projectProps['roles'] = roles };
    if (stories) { projectProps['stories'] = stories };
    if (owner) { projectProps['owner'] = owner };

    Project.findByIdAndUpdate(projectId, projectProps, { runValidators: true, context: 'query' })
      .then((project) => {
        if (project) {
          // TODO: replace hardcoded URI prefix
          return res.location('https://api.mycodebytes.com/v1/projects/'+ project._id).status(204).send(Response.success(project))
        } else {
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

  delete(req, res, next) {
    const projectId = req.params.projectId;

    Project.findByIdAndRemove(projectId)
      .then((project) => {
        if (project) {
          return res.status(204).send(Response.success(project))
        } else {
          var err = new Error();
          err.status = 404;
          next(err);
        }
      })
  }

};
