#!/bin/bash

mkdir -p ~/.vnc
x11vnc -storepasswd secret ~/.vnc/passwd > /dev/null 2>&1
x11vnc -forever -usepw -shared -rfbport 5900 -display $DISPLAY > /dev/null 2>&1 &
