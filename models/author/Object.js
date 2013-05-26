var Service = require('./Service');

/**
 * Constructor
 *
 */
function User(name, type) {
    this.name = name;
    this.type = type;
}

/**
 * Get user profile
 *
 * @param config
 * @param callback
 */
User.prototype.getUserInfo = function(config, storage, callback) {

    User.getService(config, storage).getUserInfo(this, callback);
};

/**
 * Get user service
 *
 * @param storage
 */
User.getService = function(config, storage) {

    if (!Service.service) {
        Service.service = new Service(config, storage);
    }

    return Service.service;
};

module.exports = User;