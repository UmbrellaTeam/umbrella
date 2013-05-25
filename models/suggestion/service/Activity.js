/**
 * Activity service
 *
 * @author appr
 */

var SCHEMA_NAME_ACTIVITY = 'Activity';

/**
 * Constructor
 *
 * @param storage
 */
function Service(storage) {

    var activity = new storage.Schema({
        activity: {type: String, required: true, trim: true},
        active: {type: Boolean, required: false}
    }, {strict: true});

    this.activity = storage.model(SCHEMA_NAME_ACTIVITY, activity);
}

/**
 * Save or update suggestion
 *
 * @param object
 * @param callback
 */
Service.prototype.save = function(object, callback) {

    var item = new (this.activity)();

    Object.keys(object).forEach(function(it) {
        item[it] = object[it];
    });

    item.save(function(err) {
        callback(err, item._id);
    });

};

/**
 * Destroy suggestion
 *
 * @param id
 * @param callback
 */
Service.prototype.destroy = function(id, callback) {

    this.activity.update(
        {_id: id},
        {$set: {active: false}},
        {},
        function(err) {
            callback(err, id);
        }
    );
};

/**
 * Get suggestion by id
 *
 * @param id
 */
Service.prototype.get = function(id, callback) {

    this.activity.findById(id, callback);
};

/**
 * Find items by params
 *
 * @param search
 * @param callback
 */
Service.prototype.find = function(
    search,
    callback
) {
    var filter = {}, options = {};

    var filterMap = {};

    var optionsMap = {};

    Object.keys(filterMap).forEach(function(it) {
        if (search[filterMap[it]] != undefined) {
            filter[it] = search[filterMap[it]];
        }
    });

    Object.keys(optionsMap).forEach(function(it) {
        if (search[optionsMap[it]] != undefined) {
            options[it] = search[optionsMap[it]];
        }
    });

    var self = this;

    this.activity.find(
        filter,
        {},
        options,
        function(err, result) {
            if (err) {

                return callback(err);
            }

            self.activity.count(filter, function(err, count) {
                if (err) {

                    return callback(err);
                }

                return callback(null, result, count);
            });
        }
    );
};


module.exports = Service;