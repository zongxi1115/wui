#!/usr/bin/env bash

set -euo pipefail

release_id="${1:?release id is required}"
source_dir="${2:?source directory is required}"

app_root="/home/wzx/wui"
release_dir="${app_root}/releases/${release_id}"
next_link="${app_root}/current.next"
lock_file="${app_root}/deploy.lock"

mkdir -p "${release_dir}"

exec 9>"${lock_file}"
flock 9

tar \
  --exclude=".git" \
  --exclude="node_modules" \
  --exclude=".next" \
  --exclude=".turbo" \
  --exclude=".tmp" \
  --exclude="*.tsbuildinfo" \
  -C "${source_dir}" \
  -cf - . |
  tar -C "${release_dir}" -xf -

cd "${release_dir}"

/usr/bin/pnpm install --frozen-lockfile
/usr/bin/pnpm --filter docs registry:build
/usr/bin/pnpm --filter docs build

ln -sfn "${release_dir}" "${next_link}"
mv -Tf "${next_link}" "${app_root}/current"

if /usr/bin/pm2 describe wui >/dev/null 2>&1; then
  /usr/bin/pm2 restart wui --update-env
else
  /usr/bin/pm2 start /usr/bin/pnpm \
    --name wui \
    --cwd "${app_root}/current" \
    -- \
    --filter docs start --hostname 0.0.0.0 -p 3010
fi

/usr/bin/pm2 save

curl --fail --silent --show-error \
  --retry 10 \
  --retry-delay 2 \
  --retry-connrefused \
  "http://127.0.0.1:3010/" >/dev/null

printf 'Deployed %s to %s\n' "${release_id}" "${app_root}/current"
