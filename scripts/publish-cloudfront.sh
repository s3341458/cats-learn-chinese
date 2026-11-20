#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 || -z "$1" || -z "$2" ]]; then
  echo 'Usage: bash scripts/publish-cloudfront.sh <content-bucket> <distribution-id>' >&2
  exit 2
fi

bucket=$1
distribution=$2
region=us-east-1
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export AWS_PAGER=

aws s3 sync dist/ "s3://$bucket/" --region "$region" \
  --exclude 'audio/credits.txt' --exclude 'index.html' --only-show-errors --no-progress
aws s3 cp dist/audio/credits.txt "s3://$bucket/audio/credits.txt" --region "$region" \
  --content-type 'text/plain; charset=utf-8' --only-show-errors --no-progress
aws s3 cp dist/index.html "s3://$bucket/index.html" --region "$region" \
  --content-type 'text/html; charset=utf-8' --only-show-errors --no-progress

invalidation=$(aws cloudfront create-invalidation --distribution-id "$distribution" \
  --paths '/*' --query Invalidation.Id --output text)
echo "Waiting for CloudFront invalidation $invalidation"
aws cloudfront wait invalidation-completed --distribution-id "$distribution" --id "$invalidation"
