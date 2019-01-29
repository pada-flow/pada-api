#!/usr/bin/env bash
docker run -d --name pada-api -v /Users/haowen/webProjects/popitin/pada-api:/depoly/app/pada-api -p 31544:31544 pada-api-dev