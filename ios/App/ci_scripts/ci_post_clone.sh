#!/bin/sh
set -e

echo "Moving to repo root..."
cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "Installing Node.js via Homebrew..."
brew install node

echo "Installing project dependencies..."
npm install

echo "Building web assets..."
npm run build

echo "Syncing Capacitor iOS project..."
npx cap sync ios

echo "ci_post_clone.sh finished successfully"
