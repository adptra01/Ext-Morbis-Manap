#!/usr/bin/env bash
# =============================================================================
# release.sh — rilis PRODUCTION MORBIS Ext (tag-based).
#
# Mengapa script ini ada: tag yang menunjuk commit bump "[skip ci]" TIDAK
# memicu workflow (GitHub me-skip push event untuk commit ber-marker skip-ci).
# Script membuat "release-marker commit" kosong (tanpa [skip ci]) di atas
# commit bump, lalu men-tag commit itu. Push tag → CI rilis production
# (update.xml production + Edge Store).
#
# Pra-syarat:
#   - Sudah ada rilis STAGING yang lolos verifikasi (versi X.Y.Z ada di
#     https://adptra01.github.io/Ext-Morbis-Manap/channels/staging/update.xml)
#   - Branch dev lokal sinkron (git fetch)
#
# Pemakaian:
#   bash scripts/release.sh v1.5.76
# (Argumen opsional; default = versi manifest di origin/dev terbaru.)
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."

REF_NAME="${1:-}"

# 1. Sinkronkan origin/dev
git fetch origin dev
TARGET_COMMIT=$(git rev-parse origin/dev)
MANIFEST_VER=$(git show "$TARGET_COMMIT":manifest.json | jq -r .version)

# 2. Tentukan versi rilis
if [ -n "$REF_NAME" ]; then
  VERSION="${REF_NAME#v}"
else
  echo "  (tanpa argumen → pakai versi manifest di origin/dev = $MANIFEST_VER)"
  VERSION="$MANIFEST_VER"
fi

# 3. Validasi
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "::error::versi tidak valid: $VERSION (harus X.Y.Z)" >&2; exit 1
fi
if [ "$VERSION" != "$MANIFEST_VER" ]; then
  echo "::error::v$VERSION ≠ manifest origin/dev ($MANIFEST_VER)." >&2
  echo "  Rilis production harus menunjuk commit yang versinya cocok (biasanya commit bump hasil rilis staging)." >&2
  exit 1
fi
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "::error::tag v$VERSION sudah ada (remote/local). Hapus dulu bila ingin re-tag." >&2; exit 1
fi
echo "=================================================="
echo "  Rilis PRODUCTION v$VERSION"
echo "  Tag base      : $TARGET_COMMIT ($(git log -1 --format=%s "$TARGET_COMMIT"))"
echo "=================================================="
read -r -p "  Lanjut? [y/N] " ANSWER
[ "${ANSWER:-n}" = "y" ] || { echo "dibatalkan."; exit 1; }

# 4. Release-marker commit kosong (tanpa [skip ci]) di atas base — dibuat via
#    commit-tree agar objeknya ada langsung di object store repo ini.
RELEASE_COMMIT=$(printf 'chore(release): rilis v%s → production\n' "$VERSION" \
  | git commit-tree "$TARGET_COMMIT^{tree}" -p "$TARGET_COMMIT")
echo "  Release-marker commit: $RELEASE_COMMIT"

# 5. Tag + push (push tag ikut membawa commit karena belum ada di remote)
git tag "v$VERSION" "$RELEASE_COMMIT"
git push origin "v$VERSION"
echo "  Tag v$VERSION pushed → CI rilis PRODUCTION (update.xml + Edge Store)."
echo "  Pantau: gh run list --workflow=deploy-to-main.yml --limit 3"