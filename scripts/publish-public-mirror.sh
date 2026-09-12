#!/usr/bin/env bash
# Publishes a filtered mirror of this repo — every free component, zero
# premium source — to a separate public GitHub repo. This repo stays
# private forever; reactframe-public is the only thing anyone outside
# the team ever sees. Run manually, only when you're ready to publish:
#
#   npm run publish:public
#
# Safe to re-run any time: it re-syncs the mirror to the current state of
# this repo (minus whatever is premium at that moment) and pushes again.
set -euo pipefail

PUBLIC_REPO="AhmetLoca/reactframe-public"
MIRROR_DIR="../reactframe-public"

cd "$(dirname "$0")/.."

echo "- Reading premium slugs from catalog-data.ts..."
PREMIUM_SLUGS="$(node scripts/list-premium-slugs.mts 2>/dev/null)"
echo "$PREMIUM_SLUGS" | sed '/^$/d' | sed 's/^/  - excluding: /'

if [ ! -d "$MIRROR_DIR/.git" ]; then
  if ! gh repo view "$PUBLIC_REPO" >/dev/null 2>&1; then
    echo "- Creating $PUBLIC_REPO (public)..."
    gh repo create "$PUBLIC_REPO" --public --description "ReactFrame — free, open-source shadcn-compatible components" -y
  fi
  echo "- Cloning mirror working copy into $MIRROR_DIR..."
  git clone "https://github.com/$PUBLIC_REPO.git" "$MIRROR_DIR"
fi

EXCLUDES=(
  --exclude .git --exclude node_modules --exclude .next --exclude public/r
  --exclude dist-zips --exclude __pycache__ --exclude "*.py"
)
while IFS= read -r slug; do
  [ -n "$slug" ] && EXCLUDES+=(--exclude "registry/new-york/$slug")
done <<< "$PREMIUM_SLUGS"

echo "- Syncing files..."
rsync -a --delete "${EXCLUDES[@]}" ./ "$MIRROR_DIR/"

# rsync's --exclude list only knows how to drop whole registry/new-york/<slug>
# folders — several other files mix free and premium data together in the
# same object (code-variants.ts, usage-examples.ts, checkout-links.ts,
# registry.json, registry-preview/index.tsx) and need real parsing to filter
# safely. This also deletes any leftover file that still imports a premium
# registry path, and throws — aborting this script before anything is
# committed or pushed — if any premium import survives the pass.
echo "- Stripping premium entries from shared data files..."
(cd "$MIRROR_DIR" && node scripts/strip-premium-shared-data.mts)

# The public mirror never contains premium source, so it ships under a
# plain MIT license — no need for the private repo's split-license notice.
cat > "$MIRROR_DIR/LICENSE" <<'EOF'
MIT License

Copyright (c) 2026 ReactFrame

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

cd "$MIRROR_DIR"
sed -i.bak 's/"license": "SEE LICENSE IN LICENSE"/"license": "MIT"/' package.json && rm -f package.json.bak

git add -A
if git diff --cached --quiet; then
  echo "- Nothing changed, mirror already up to date."
  exit 0
fi

git commit -m "Sync public mirror ($(date -u +%Y-%m-%d))"
git push origin main
echo "- Done: https://github.com/$PUBLIC_REPO"
