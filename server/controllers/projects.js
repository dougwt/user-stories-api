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

  },

  update(req, res, next) {
    const projectId = req.params.projectId;
    const projectProps = req.body;

  },

  delete(req, res, next) {
    const projectId = req.params.projectId;

  }

};
