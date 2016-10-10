#!/bin/bash

source headless/env.sh

shutdown() {
  kill -s SIGTERM $PID 2>/dev/null
  wait $PID 2>/dev/null
}

rm -f /tmp/.X*lock

DISPLAY=$DISPLAY xvfb-run -a --server-args="-screen 0 $GEOMETRY -ac +extension RANDR" node bin/network-har "$@" &
PID=$!
trap shutdown SIGTERM SIGINT

# wait for the xvfb server to start
for retry in $(seq 1 50)
do
  xdpyinfo -display $DISPLAY >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    break
  fi
  sleep 0.1
done
