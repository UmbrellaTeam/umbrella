/**
 * Suggestion object
 *
 * @author appr
 */
var Service = require('./Service');

/**
 * Constructor
 *
 * @param options
 */
function Activity(options) {

    if (options.id) {
        this._id = options.id;
    }

    this.activity = options.activity;
}

/**
 * Save activity
 *
 * @param storage
 * @param callback
 */
Activity.prototype.save = function(storage, callback) {

    var self = this;

    Activity.getService(storage).save(
        this,
        function(err, result) {
            if (!err && result) {
                self._id = result;
            }

            callback(err, result);
        }
    );
};

/**
 * Find items
 *
 * @param storage
 * @param options
 * @param callback
 */
Activity.find = function(
    storage,
    options,
    callback
) {

    Activity.getService(storage).find(
        options,
        function(err, result, count) {
            if (err) {

                return callback(err);
            }

            var items = [];

            result.forEach(function(it) {

                items.push(new Activity(it));
            });

            callback(null, items, count);
        }
    );
};

/**
 * Delete suggestion
 *
 * @param storage
 * @param id
 * @param callback
 */
Activity.destroy = function(storage, id, callback) {

    Activity.getService(storage).destroy(id, callback);
};

/**
 * Get suggestion service
 *
 * @param storage
 */
Activity.getService = function(storage) {

    if (!Activity.service) {
        Activity.service = new Service.Activity(storage);
    }

    return Activity.service;
};

module.exports = Activity;
