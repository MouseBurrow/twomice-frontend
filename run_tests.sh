#!/usr/bin/env bash
# Runs frontend CI checks.
#
# Usage: ./run_tests.sh
set -euo pipefail

git config core.hooksPath .githooks 2>/dev/null || true

git config core.hooksPath .githooks 2>/dev/null || true

echo "=== Lint ==="
npm run lint 2>&1

echo "=== Typecheck ==="
npx tsc -b 2>&1

echo "=== Build ==="
npm run build 2>&1

echo "=== All checks passed ==="
