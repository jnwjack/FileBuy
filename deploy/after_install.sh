#!/bin/bash
cd /home/bitnami/source/FileBuy
git pull
git secret reveal -f -p $SECRET_PWD
sudo cp auth/CLIENT_ID ../../htdoc/auth/CLIENT_ID
sudo cp	auth/CLIENT_SECRET ../../htdoc/auth/CLIENT_SECRET
