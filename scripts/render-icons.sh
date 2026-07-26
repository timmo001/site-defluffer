#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
source_icon="$repo_dir/icons/icon.svg"

if ! command -v magick >/dev/null 2>&1; then
  printf 'ImageMagick is required to render extension icons.\n' >&2
  exit 1
fi

for size in 16 32 48 128; do
  magick -background none "$source_icon" \
    -resize "${size}x${size}" "PNG32:$repo_dir/icons/icon-$size.png"
done
