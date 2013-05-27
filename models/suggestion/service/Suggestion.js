/**
 * Suggestion service
 *
 * @author appr
 */

var SCHEMA_NAME_SUGGESTION = 'Suggestion';
var SCHEMA_NAME_ACTIVITY = 'Activity';

var ObjectId = require('mongoose').Types.ObjectId;

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
    var query = this.suggestion.find({});

    if (search.date) {
        var date = new Date(search.date);
        query.or([
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
        ]);
    }

    if (search.cloudiness) {
        query.where('cloudiness',  search.cloudiness);
    }

    if (search.activity) {
        query.or([
            {
                activity: new ObjectId(search.activity)
            },
            {
                activity: null
            }
        ]);
    }

    if (search.id) {
        query.where('_id',  new ObjectId(search.id));
    }

    if (search.skip) {
        query.skip(search.skip);
    }

    if (search.limit) {
        query.limit(search.limit);
    }

    query.exec(
        function(err, result) {
            if (err) {

                return callback(err);
            }

            query.count(function(err, count) {
                if (err) {

                    return callback(err);
                }

                return callback(null, result, count);
            });
        }
    );
};


module.exports = Service;