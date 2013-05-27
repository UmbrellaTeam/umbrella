/**
 * Suggestion service
 *
 * @author appr
 */

var SCHEMA_NAME_SUGGESTION = 'Suggestion';
var SCHEMA_NAME_ACTIVITY = 'Activity';

/**
 * Constructor
 *
 * @param storage
 */
function Service(storage) {

    var suggestion = new storage.Schema({
        suggestion: {type: String, required: true, trim: true},
        cloudiness: {type: String, required: true},
        dateStart: {type: Date, required: false},
        dateEnd: {type: Date, required: false},
        season: {type: String, required: false},
        author: {type: String, required: false},
        authorType: {type: String, required: false},
        activity: {
            type: storage.Schema.ObjectId,
            ref: SCHEMA_NAME_ACTIVITY,
            required: false
        },
        active: {type: Boolean, required: false}
    }, {strict: true});

    this.suggestion = storage.model(SCHEMA_NAME_SUGGESTION, suggestion);
    this.storage = storage;
}

/**
 * Save or update suggestion
 *
 * @param object
 * @param callback
 */
Service.prototype.save = function(object, callback) {

    var item = new (this.suggestion)();

    Object.keys(object).forEach(function(it) {
        item[it] = object[it];
    });

    item.save(function(err) {
        callback(err, item._id);
    });

};

/**
 * Update item
 *
 * @param id
 * @param params
 * @param callback
 */
Service.prototype.update = function(id, params, callback) {

    this.suggestion.update(
        {_id: id},
        {$set: params},
        {},
        callback
    );
};

/**
 * Destroy suggestion
 *
 * @param id
 * @param callback
 */
Service.prototype.destroy = function(id, callback) {

    this.suggestion.update(
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

    this.suggestion.findById(id, callback);
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

    if (search.date) {
        var date = new Date(search.date);
        filter.$or = [
            {
                $and: [
                    {
                        dateStart: {
                            $lte: date
                        }
                    },
                    {
                        dateEnd: {
                            $gte: date
                        }
                    }
                ]
            },
            {
                $and: [
                    {
                        dateStart: null
                    },
                    {
                        dateEnd: null
                    }
                ]
            }
        ];
    }

    if (search.cloudiness) {
        filter.cloudiness = search.cloudiness;
    }

    if (search.activity) {
        var ObjectId = require('mongoose').Types.ObjectId;
        filter.activity = {
            $or: [
                {
                    activity: new ObjectId(search.activity)
                },
                {
                    activity: null
                },
            ]
        };
    }

    var filterMap = {
        _id: 'id'
    };

    var optionsMap = {
        skip: 'skip',
        limit: 'limit'
    };

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

    this.suggestion.find(
        filter,
        'activity season suggestion dateStart dateEnd author authorType',
        options,
        function(err, result) {
            if (err) {

                return callback(err);
            }

            self.suggestion.count(filter, function(err, count) {
                if (err) {

                    return callback(err);
                }

                return callback(null, result, count);
            });
        }
    );
};


module.exports = Service;