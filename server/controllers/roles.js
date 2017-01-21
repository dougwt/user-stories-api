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
