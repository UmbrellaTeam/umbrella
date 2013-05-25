/**
 * Weather server
 *
 * @author appr
 */

var Runnable = require('runnable'),
    IniConf = require('iniconfig'),
    express = require('express'),
    util = require('util'),
    os = require('os'),
    io = require('socket.io'),
    mongoose = require('mongoose'),
    redis = require('socket.io/node_modules/redis'),
    RedisStore = require('socket.io/lib/stores/redis')
;

/**
 * Create threaded instance
 *
 * @param masterTitle
 * @param workerTitle
 * @param uid
 * @param gid
 * @param workersNum
 */
function Application(masterTitle, workerTitle, uid, gid, workersNum) {
    this.masterTitle = masterTitle;
    this.workerTitle = workerTitle;
    this.uid = uid;
    this.gid = gid;
    this.workersNum = workersNum || Runnable.DEFAULT_WORKERS_NUM;
}

util.inherits(Application, Runnable);

/**
 * Set config
 *
 * @param config
 */
Application.prototype.setConfig = function(config) {
    this.config = config;

    return this;
};

/**
 * Initialize global objects
 *
 */
Application.prototype.initWorker = function() {

    mongoose.connect(
        process.env.MONGO_CONNECT || this.config.mongo.connectString
    );

    var storage = mongoose.connection;
    storage.on('open', function() {
        console.log('Connected to storage')
    });
    storage.on('error', function(err) {
        console.warn(err);
    });

    var pub = redis.createClient(
            process.env.REDIS_PORT || this.config.redis.port,
            process.env.REDIS_HOST || this.config.redis.host
        ),
        sub = redis.createClient(
            process.env.REDIS_PORT || this.config.redis.port,
            process.env.REDIS_HOST || this.config.redis.host
        ),
        store = redis.createClient(
            process.env.REDIS_PORT || this.config.redis.port,
            process.env.REDIS_HOST || this.config.redis.host
        )
    ;

    var redisPassword = process.env.REDIS_PASSWORD || this.config.redis.password;

    if (redisPassword) {
        pub.auth(redisPassword);
        sub.auth(redisPassword);
        store.auth(redisPassword);
    }

    pub.on('error', function(err) {
        console.warn(err);
    });
    sub.on('error', function(err) {
        console.warn(err);
    });
    store.on('error', function(err) {
        console.warn(err);
    });

    var app = express();
    var http = require('http');
    var server = http.createServer(app);

    require('./mvc').boot(app, mongoose, store, this.config);

    server.listen(
        process.env.app_port || this.config.global.socket,
        this.config.global.interface
    );

    return this;
};

/**
 * Start application
 *
 */
Application.prototype.startWorkers = function() {

    return this;
};

/**
 * Start application
 *
 */
(function() {
    var config = IniConf.readConfig(__dirname + '/conf/application');

    var app = new Application(
        config.process.masterTitle,
        config.process.workerTitle,
        config.process.uid,
        config.process.gid,
        process.env.THREADS || os.cpus().length
    );

    app
        .setConfig(config)
        .start()
    ;
})();

