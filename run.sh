#!/bin/sh

### BEGIN INIT INFO
# Provides:          node-umbrella
# Required-Start:    $local_fs $remote_fs $network $syslog
# Required-Stop:     $local_fs $remote_fs $network $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts node-umbrella
# Description:       starts node-umbrella
### END INIT INFO


DEBUG_LOG_FILE=/var/log/node-umbrella/debug.log
ERROR_LOG_FILE=/var/log/node-umbrella/error.log
PID_FILE=/var/run/node-umbrella.pid
DAEMON=app.js
NAME=node-umbrella
DESC=node-umbrella

WORKING_DIR=/home/umbrella/node-umbrella/

export NODE_PATH=/usr/local/lib/node_modules/

test -r $WORKING_DIR$DAEMON || exit 0

set -e

start() {
    cd $WORKING_DIR
    node $DAEMON >> $DEBUG_LOG_FILE 2>> $ERROR_LOG_FILE &
    echo -n $! > $PID_FILE
}

stop() {
    kill -s TERM `cat $PID_FILE`
}

case "$1" in
    start)
        echo "Starting $DESC"
        start
        ;;
    stop)
        echo "Stoping $DESC"
        stop
        ;;
    restart)
        echo "Stopping $DESC"
        stop
        sleep 1
        echo "Starting $DESC"
        start
        ;;
    graceful-restart)
        echo "Gracefully restarting $DESC"
        kill -s USR1 `cat $PID_FILE`
        ;;
esac

