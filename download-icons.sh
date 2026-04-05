#!/bin/bash
# Download placeholder icons for Chrome Extension

echo "Downloading placeholder icons..."
echo

mkdir -p icons

echo "Downloading icon16.png..."
curl -o icons/icon16.png "https://placehold.co/16x16/4285f4/ffffff?text=D"

echo "Downloading icon48.png..."
curl -o icons/icon48.png "https://placehold.co/48x48/4285f4/ffffff?text=Detail"

echo "Downloading icon128.png..."
curl -o icons/icon128.png "https://placehold.co/128x128/4285f4/ffffff?text=DT"

echo
echo "Done! Icons saved in icons/ folder"
