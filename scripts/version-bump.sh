#!/usr/bin/env bash
#
# Bump the plugin version in package.json and chek-description-list.php.
#
# Usage:
#   npm run version:patch        # 1.0.1 → 1.0.2
#   npm run version:minor        # 1.0.1 → 1.1.0
#   npm run version:major        # 1.0.1 → 2.0.0
#   npm run version -- 2.3.0     # explicit version
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PHP_FILE="$ROOT/chek-description-list.php"

BUMP="${1:-patch}"

# Save the old version before npm touches package.json.
OLD_VERSION="$(node -p "require('$ROOT/package.json').version")"

# Bump package.json (--no-git-tag-version so we stay in control).
npm version "$BUMP" --no-git-tag-version --allow-same-version > /dev/null

NEW_VERSION="$(node -p "require('$ROOT/package.json').version")"

if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
	echo "Version unchanged ($OLD_VERSION)."
	exit 0
fi

# Update the PHP plugin header.
sed -i '' "s/ \* Version:           $OLD_VERSION/ * Version:           $NEW_VERSION/" "$PHP_FILE"

echo "Bumped $OLD_VERSION → $NEW_VERSION"
echo "  - package.json ✓"
echo "  - chek-description-list.php ✓"
echo ""
echo "Don't forget to add a CHANGELOG.md entry for $NEW_VERSION."
