/**
 * Bootstrap
 */

var fs = require('fs'),
    express = require('express')
;

exports.boot = function(app, storage, config) {
    bootApplication(app);
    bootControllers(app, storage, config);
};

/**
 * App settings and middleware
 *
 */
function bootApplication(app) {
    var expressValidator = require('express-validator');
    app.use(express.logger(':method :url :status'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(expressValidator);
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function(){
        app.use(express.errorHandler());
    });

    // Example 500 page
    app.use(function(err, req, res, next) {
        res.statusCode = 500;
        res.send(JSON.stringify(err));
    });

    // Example 404 page via simple Connect middleware
    app.use(function(req, res) {
        res.statusCode = 404;
        res.send('');
    });
}

/**
 * Bootstrap controllers
 *
 */
function bootControllers(app, storage, config) {
    fs.readdir(__dirname + '/controllers', function(err, files) {
        if (err) {
            throw err;
        }
        files.forEach(function(file) {
            bootController(app, file, storage, config);
        });
    });
}

/**
 * Example (simplistic) controller support
 *
 */
function bootController(app, file, storage, config) {
    var name = file.replace('.js', ''),
        actions = require('./controllers/' + name),
        plural = name + 's', // realistically we would use an inflection lib
        prefix = '/' + plural
    ;

    // Special case for "index"
    if (name == 'index') {
        prefix = '/';
    }
    actions.storage = storage;
    actions.config = config;

    Object.keys(actions).map(function(action) {
        var fn = controllerAction(name, plural, action, actions[action]);
        switch (action) {
            case 'index':
                app.get(prefix, fn);
                break;
            case 'show':
                app.get(prefix + '/:id.:format?', fn);
                break;
            case 'add':
                app.get(prefix + '/add', fn);
                break;
            case 'create':
                app.post(prefix + '/', fn);
                break;
            case 'edit':
                app.get(prefix + '/:id/edit', fn);
                break;
            case 'update':
                app.put(prefix + '/:id', fn);
                break;
            case 'destroy':
                app.del(prefix + '/:id', fn);
                break;
            default:
                app.get(prefix + '/' + action, fn);
                app.post(prefix + '/' + action, fn);
                break;
        }
    });
}

// Proxy res.render() to add some magic

function controllerAction(name, plural, action, fn) {

    return function(req, res, next) {

        req.errors = [];

        /**
         * Check if request has errors
         *
         */
        req.hasErrors = function() {
            
            return req.errors && req.errors.length;
        };

        /**
         * Get request errors
         *
         */
        req.getErrors = function() {

            return req.errors || [];
        };

        /**
         * Get all request params
         *
         */
        req.getParams = function() {

            var result = {}, self = this;

            Object.keys(this.params).forEach(function(it) {
                result[it] = self.param(it);
            });

            Object.keys(this.body).forEach(function(it) {
                result[it] = self.param(it);
            });

            Object.keys(this.query).forEach(function(it) {
                result[it] = self.param(it);
            });

            return result;
        };

        /**
         * Return error to the client
         *
         * @param error
         */
        res.error = function(error) {

            res.statusCode = error.code || 500;
            res.send(
                typeof error.stringify == 'function'
                    ? error.stringify()
                    : JSON.stringify(error)
            );
        };

        /**
         * Return 'created' result to the client
         *
         * @param result
         */
        res.created = function(result) {

            res.statusCode = 201;
            if (result) {
                res.write(
                    typeof result.stringify == 'function'
                        ? result.stringify()
                        : JSON.stringify(result)
                );
            }
            res.end();
        };

        req.onValidationError(function(message) {
            console.log('Validation error: ' + message);
            req.errors.push(message);
        });

        fn.apply(this, arguments);
    };
}