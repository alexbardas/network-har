#!/bin/bash

source headless/env.sh
source headless/xvfb.sh "$@"
source headless/window-manager.sh
source headless/vnc.sh
