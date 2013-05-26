/**
 * Twitter publisher
 *
 * @author appr
 */

var Twitter = require('twitter');
var Error = require('error');

/**
 * Constructor
 *
 * @param options
 */
function Service(config, storage) {

    this.config = config;
    this.storage = storage;
}

Service.USER_INFO_TTL = 86400;

/**
 * Save or update item
 *
 * @param object
 * @param callback
 */
Service.prototype.getUserInfo = function(object, callback) {

    var self = this;

    this.storage.GET('users:' + object.type + ':' + object.name, function(err, result) {

        if (err) {

            return callback(
                new Error(
                    'Failed to get userinfo: ' + (err.message || 'Unknown error'),
                    err,
                    Error.CODE_SERVER_ERROR
                )
            );
        }

        if (!result) {

            return self.getAndSaveTwitterInfo(object, function(err, result) {

                if (err) {

                    return callback(
                        new Error(
                            'Failed to get userinfo: ' +
                                (typeof err == 'object' && err.message ? err.message : 'Unknown error'),
                            err,
                            Error.CODE_SERVER_ERROR
                        )
                    );
                }

                if (!result) {

                    return callback(
                        new Error(
                            'Failed to get userinfo: user not found',
                            null,
                            Error.CODE_SERVER_ERROR
                        )
                    );
                }

                return callback(null, result);
            });
        }

        var parsedResult = null;

        try {
            parsedResult = JSON.parse(result);
        } catch (e) {
            parsedResult = null;
        }

        return callback(null, parsedResult);

    });
};

/**
 * Get and save userinfo
 *
 * @param object
 * @param callback
 */
Service.prototype.getAndSaveTwitterInfo = function(object, callback) {

    var self = this;

    var twit = new Twitter({
        consumer_key: this.config.twitter.consumerKey,
        consumer_secret: this.config.twitter.consumerSecret,
        access_token_key: this.config.twitter.token,
        access_token_secret: this.config.twitter.tokenSecret
    });

    console.log('req to twee');

    twit.get(
        '/users/show.json',
        {screen_name: object.name},
        function(data) {
            if (data && data.id) {

                return self.saveUserInfo(object, data, function(err) {

                    if (err) {

                        return new Error(
                            'Failed to save userinfo: ' + (err.message || 'Unknown error'),
                            err,
                            Error.CODE_SERVER_ERROR
                        );
                    }

                    return callback(null, data);

                });
            }

            return callback(data, null);
        }
    );
};

/**
 * Save user info
 *
 * @param object
 * @param data
 * @param callback
 */
Service.prototype.saveUserInfo = function(object, data, callback) {

    this.storage.SETEX(
        'users:' + object.type + ':' + object.name,
        Service.USER_INFO_TTL,
        JSON.stringify(data), callback
    );
};

module.exports = Service;