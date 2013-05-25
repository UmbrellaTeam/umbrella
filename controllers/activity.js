/**
 * Activity controller
 *
 * @author appr
 */

var Error = require('error'),
    Activity = require('../models/suggestion/Activity'),
    Constants = require('../models/suggestion/Constants')
;

module.exports = {

    /**
     * Get activities
     *
     * @param req
     * @param res
     */
    index: function(req, res) {

        var search = {};

        search.offset = search.offset || Constants.DEFAULT_OFFSET;
        search.count = search.count || Constants.DEFAULT_COUNT;

        Activity.find(
            module.exports.storage,
            search,
            function(err, result) {
                if (err) {

                    return res.error(
                        new Error(
                            'Failed to get activities: ' + (err.message || 'Unknown error'),
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
     * Create activity
     *
     * @param req
     * @param res
     */
    create: function(req, res) {
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

        var options = req.getParams();

        new Activity(options).save(
            module.exports.storage,
            function(err, result) {
                if (err) {

                    return res.error(
                        new Error(
                            'Failed to save activity: ' + (err.message || 'Unknown error'),
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

        Activity.destroy(
            module.exports.storage,
            req.param('id'),
            function(err, result) {
                if (err) {

                    return res.error(
                        new Error(
                            'Failed to destroy activity: ' + (err.message || 'Unknown error'),
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
