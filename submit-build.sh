#! /bin/bash

set -e
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $ROOT_DIR

echo "Submitting build to Google Cloud..."
gcloud builds submit \
  --config ./gcloud/cloudbuild.yaml \
  --substitutions=REPO_NAME=$(basename $(git remote get-url origin)),TAG_NAME=$(git describe --tags --abbrev=0),BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD),SHORT_SHA=$(git log -1 --pretty=%h) \
  .