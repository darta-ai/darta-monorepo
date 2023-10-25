#!/bin/bash

if [ "$ENVIRONMENT" == "prod" ]; then
  cp -r ./environments/prod/GoogleService-Info.plist ./GoogleService-Info.plist
else
  cp -r ./environments/dev/GoogleService-Info.plist ./GoogleService-Info-dev.plist
fi
