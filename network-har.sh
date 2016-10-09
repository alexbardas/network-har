#!/bin/bash
xvfb-run --server-args="-screen 0 1920x2000x24" node bin/network-har "$@"
