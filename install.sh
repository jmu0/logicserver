#!/bin/bash
path="/var/local/node/logicserver/"
mkdir -p $path
rsync -a --delete --verbose --progress * $path
