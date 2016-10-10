#!/bin/bash

# check if one of the arguments is --debug
for arg in "$@"; do
  if [[ $arg == "--debug" ]]; then DEBUG=true; break; fi
done
unset arg

if [[ -n $DEBUG ]]
then
  source headless/debug.sh "$@"
else
  source headless/xvfb.sh "$@"
fi

wait $PID 2>/dev/null
