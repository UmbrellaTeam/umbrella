/**
 * Suggestion controller
 *
 * @author appr
 */

var Error = require('error'),
    Suggestion = require('../models/suggestion/Suggestion'),
    Constants = require('../models/suggestion/Constants')
;

module.exports = {

    /**
     * Get suggestion
     *
     * @param req
     * @param res
     */
    find: function(req, res) {

        req.assert('activity', 'activity validation failed').notEmpty();

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
     * Create suggestion
     *
     * @param req
     * @param res
     */
    create: function(req, res) {
        req.assert('activity', 'activity validation failed').notEmpty();
        req.assert('temperatureMin', 'temperatureMin validation failed').notEmpty();
        req.assert('temperatureMax', 'temperatureMax validation failed').notEmpty();
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
