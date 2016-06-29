/// Libs
var config = require('../libs/config');
/// Controllers
var projectController = require('../controllers/project.js');

var ProjectRegisterRoutes = function (router, authenticate, sendError) {
    //TODO: add authentication

    router.param('id', function (req, res, next, id) {
        projectController.getById({
            id: id,
            accessToken: req.query.access_token
        })
            .then(function (result) {
                req.result = result;
                req.project = result.project;
                next();
            })
            .fail(function (error) {
                req.error = error;
                next();
            });
    });
    
    router.post('/projects', authenticate, function (req, res) {
        projectController.post({
            name: req.body.name,
            userId: req.user._id
        })
            .then(function (project) {
                res.json(project);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });

    router.get('/projects', authenticate, function (req, res) {
        projectController.getAll({
            userId: req.user._id
        })
            .then(function (projects) {
                res.json(projects);
            })
            .fail(function (error) {
                sendError(error, res);
            });
    });

    router.get('/projects/:id', authenticate, function (req, res) {
        if (!req.project) {
            sendError(req.error, res);
        } else {
            res.json(req.result);
        }
    });

    router.post('/projects/:id/update-currencies', authenticate, function (req, res) {
        if (!req.project) {
            sendError(req.error, res);
        } else {
            projectController.updateCurrencies({
                project: req.project,
                userId: req.user._id,
                currencies: req.body.currencies
            })
                .then(function (project) {
                    res.json(project);
                })
                .fail(function (error) {
                    sendError(error, res);
                });
        }
    });


    router.post('/projects/:id/rename', authenticate, function (req, res) {
        if (!req.project) {
            sendError(req.error, res);
        } else {
            projectController.rename({
                project: req.project,
                userId: req.user._id,
                name: req.body.name
            })
                .then(function (project) {
                    res.json(project);
                })
                .fail(function (error) {
                    sendError(error, res);
                });
        }
    });
};

module.exports = {
    register: ProjectRegisterRoutes
};
