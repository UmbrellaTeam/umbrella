/**
 * Activity controller
 *
 * @author appr
 */

var Error = require('error'),
    Author = require('../models/author/Object')
;

module.exports = {

    /**
     * Get picture
     *
     * @param req
     * @param res
     */
    picture: function(req, res) {

        req.assert('name', 'name validation failed').notEmpty();

        if (req.hasErrors()) {

            return res.error(
                new Error(
                    'Validation failed',
                    req.getErrors(),
                    Error.CODE_BAD_REQUEST
                )
            );
        }

        var author = new Author(req.param('name'), req.param('type') || 'twitter');
        author.getUserInfo(module.exports.config, module.exports.redis, function(err, result) {

            if (err || !result || !result.profile_image_url) {

                return res.redirect('/img/1px.gif');
            }

            return res.redirect(result.profile_image_url);
        });
    }
};
