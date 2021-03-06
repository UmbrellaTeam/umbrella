/**
 * Suggestion controller
 *
 * @author appr
 */

var Error = require('error'),
    Suggestion = require('../models/suggestion/Suggestion'),
    Weather = require('../models/weather/Object'),
    Constants = require('../models/suggestion/Constants'),
    Author = require('../models/author/Object');

module.exports = {

    /**
     * Get all suggestions
     *
     * @param req
     * @param res
     */
    index: function(req, res) {

        var search = req.getParams();

        search.offset = search.offset || Constants.DEFAULT_OFFSET;
        search.count = search.count || Constants.DEFAULT_COUNT;

        Suggestion.find(
            module.exports.storage,
            search,
            function(err, result) {
                if (err) {

                    return res.error(
                        new Error(
                            'Failed to find suggestion: ' + (err.message || 'Unknown error'),
                            err,
                            Error.CODE_SERVER_ERROR
                        )
                    );
                }

                res.send(result);
            })
        ;
    },

    /**
     * Get suggestion
     *
     * @param req
     * @param res
     */
    find: function(req, res) {
        req.assert('date', 'date validation failed').notEmpty();

        if (req.hasErrors()) {

            return res.error(
                new Error(
                    'Validation failed',
                    req.getErrors(),
                    Error.CODE_BAD_REQUEST
                )
            );
        }

        var search = req.getParams();

        search.offset = search.offset || Constants.DEFAULT_OFFSET;
        search.count = search.count || Constants.DEFAULT_COUNT;

        var myResponse = {};

        Weather.get(module.exports.redis, search, function(err, result) {
            if (err) {

                return res.error(
                    new Error(
                        'Failed to get weather forecast: ' + (err.message || 'Unknown error'),
                        err,
                        Error.CODE_SERVER_ERROR
                    )
                );
            }

            if (!result) {

                return res.error(
                    new Error(
                        'Failed to get weather forecast: forecast for specified date was not found',
                        err,
                        Error.CODE_SERVER_ERROR
                    )
                );
            }

            search.cloudiness = result.day.cloudiness;

            myResponse.weather = result;

            Suggestion.find(
                module.exports.storage,
                search,
                function(err, result) {
                    if (err) {

                        return res.error(
                            new Error(
                                'Failed to find suggestion: ' + (err.message || 'Unknown error'),
                                err,
                                Error.CODE_SERVER_ERROR
                            )
                        );
                    }

                    if (result && result.length) {

                        var suggestion = result[Math.floor(Math.random() * result.length)];
                        myResponse.suggestion = suggestion;

                        if (suggestion && suggestion.author) {

                            var author = new Author(suggestion.author, suggestion.authorType || 'twitter');

                            return author.getUserInfo(module.exports.config, module.exports.redis, function(err, profile) {

                                if (err || !profile || !profile.profile_image_url) {
                                    suggestion.authorProfilePic = '/img/1px.gif';
                                } else {
                                    suggestion.authorProfilePic = profile.profile_image_url;
                                }

                                return res.send(myResponse);
                            });
                        }
                    }

                    res.send(myResponse);
                }
            );
        });
    },

    /**
     * Create suggestion
     *
     * @param req
     * @param res
     */
    create: function(req, res) {
        req.assert('cloudiness', 'cloudiness validation failed').notEmpty();
        req.assert('suggestion', 'suggestion validation failed').notEmpty();

        if (req.hasErrors()) {

            return res.error(
                new Error(
                    'Validation failed',
                    req.getErrors(),
                    Error.CODE_BAD_REQUEST
                )
            );
        }

        var options = req.getParams();

        new Suggestion(options).save(
            module.exports.storage,
            function(err, result) {
                if (err) {

                    return res.error(
                        new Error(
                            'Failed to save suggestion: ' + (err.message || 'Unknown error'),
                            err,
                            Error.CODE_SERVER_ERROR
                        )
                    );
                }

                res.created(result);
            }
        );
    },

    /**
     * Update suggestion
     *
     * @param req
     * @param res
     */
    update: function(req, res) {
        req.assert('id', 'id validation failed').notEmpty();

        if (req.hasErrors()) {

            return res.error(
                new Error(
                    'Validation failed',
                    req.getErrors(),
                    Error.CODE_BAD_REQUEST
                )
            );
        }

        var options = req.getParams();

        Suggestion.update(
            module.exports.storage,
            req.param('id'),
            options,
            function(err, result) {
                if (err) {

                    return res.error(
                        new Error(
                            'Failed to update suggestion: ' + (err.message || 'Unknown error'),
                            err,
                            Error.CODE_SERVER_ERROR
                        )
                    );
                }

                res.created(result);
            }
        );
    },

    /**
     * Delete suggestion
     *
     */
    destroy: function(req, res) {
        req.assert('id', 'id validation failed').notEmpty();

        if (req.hasErrors()) {

            return res.error(
                new Error(
                    'Validation failed',
                    req.getErrors(),
                    Error.CODE_BAD_REQUEST
                )
            );
        }

        Suggestion.destroy(
            module.exports.storage,
            req.param('id'),
            function(err, result) {
                if (err) {

                    return res.error(
                        new Error(
                            'Failed to destroy suggestion: ' + (err.message || 'Unknown error'),
                            err,
                            Error.CODE_SERVER_ERROR
                        )
                    );
                }

                res.send(result);
            }
        );
    }

};
