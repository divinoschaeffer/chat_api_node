#!/bin/bash

CONTAINER_NAME="chat-api"

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <npm_command>"
  echo "Example: $0 install"
  echo "Commands: install | update | test"
  exit 1
fi

NPM_COMMAND=$1

if [[ "$NPM_COMMAND" != "install" && "$NPM_COMMAND" != "update" && "$NPM_COMMAND" != "test" ]]; then
  echo "Error: Invalid command '$NPM_COMMAND'. Use 'install' or 'update'."
  exit 1
fi

echo "Running 'npm $NPM_COMMAND' in container '$CONTAINER_NAME'..."
docker exec -it "$CONTAINER_NAME" npm "$NPM_COMMAND"

# shellcheck disable=SC2181
if [[ $? -eq 0 ]]; then
  echo "Command 'npm $NPM_COMMAND' executed successfully in container '$CONTAINER_NAME'."
else
  echo "Error: Failed to run 'npm $NPM_COMMAND' in container '$CONTAINER_NAME'."
  exit 1
fi
