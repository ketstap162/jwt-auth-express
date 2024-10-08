#!/bin/bash

if [ "$DEBUG" = "true" ]; then
  pnpm run start-dev
else
  pnpm run start
fi