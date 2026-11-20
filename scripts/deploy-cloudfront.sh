#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo 'Usage: bash scripts/deploy-cloudfront.sh <site-domain> <public-hosted-zone-id> [stack-name]' >&2
  exit 2
fi

site_domain=$1
hosted_zone_id=$2
stack_name=${3:-cats-learn-chinese}
region=us-east-1
cd "$(dirname "${BASH_SOURCE[0]}")/.."
export AWS_PAGER=

read -r zone_name is_private <<< "$(aws route53 get-hosted-zone --id "$hosted_zone_id" \
  --query 'HostedZone.[Name,Config.PrivateZone]' --output text)"
if [[ "$is_private" != False || "$site_domain" != *."${zone_name%.}" ]]; then
  echo 'The site hostname must be a subdomain of the supplied public Route 53 zone.' >&2
  exit 2
fi

npm run check
aws cloudformation deploy --region "$region" --stack-name "$stack_name" \
  --template-file infra/cloudfront.yml --no-fail-on-empty-changeset \
  --parameter-overrides "SiteDomain=$site_domain" "HostedZoneId=$hosted_zone_id"

stack_output() {
  aws cloudformation describe-stacks --region "$region" --stack-name "$stack_name" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue | [0]" --output text
}

bucket=$(stack_output ContentBucket)
distribution=$(stack_output DistributionId)
bash scripts/publish-cloudfront.sh "$bucket" "$distribution"
stack_output SiteUrl
