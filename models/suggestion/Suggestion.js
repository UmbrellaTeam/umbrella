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
function Suggestion(options) {

    if (options.id) {
        this._id = options.id;
    }

    this.activity = options.activity;
//    this.cloudiness = options.cloudiness;
//    this.temperatureMin = options.temperatureMin;
//    this.temperatureMax = options.temperatureMax;
    this.suggestion = options.suggestion;
//    this.timeOfDay = options.timeOfDay;
    this.date = options.date;
}

/**
 * Save suggestion
 *
 * @param storage
 * @param callback
 */
Suggestion.prototype.save = function(storage, callback) {

    var self = this;

    Suggestion.getService(storage).save(
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
 * Update item
 *
 * @param storage
 * @param callback
 */
Suggestion.update = function(storage, id, params, callback) {

    Suggestion.getService(storage).update(id, params, callback);
};

/**
 * Find items
 *
 * @param storage
 * @param options
 * @param callback
 */
Suggestion.find = function(
    storage,
    options,
    callback
) {

    Suggestion.getService(storage).find(
        options,
        function(err, result, count) {
            if (err) {

                return callback(err);
            }

            var items = [];

            result.forEach(function(it) {

                items.push(new Suggestion(it));
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
Suggestion.destroy = function(storage, id, callback) {

    Suggestion.getService(storage).destroy(id, callback);
};

/**
 * Get suggestion service
 *
 * @param storage
 */
Suggestion.getService = function(storage) {

    if (!Suggestion.service) {
        Suggestion.service = new Service.Suggestion(storage);
    }

    return Suggestion.service;
};

module.exports = Suggestion;
