#!/bin/bash
cd /home/bitnami/source/FileBuy
git pull
git secret reveal -f -p $SECRET_PWD
sudo cp auth/CLIENT_ID /opt/bitnami/apache/htdocs/auth/CLIENT_ID
sudo cp	auth/CLIENT_SECRET /opt/bitnami/apache/htdocs/auth/CLIENT_SECRET
cd /opt/bitnami/apache/htdocs
composer update