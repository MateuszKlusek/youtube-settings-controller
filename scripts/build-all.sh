#!/bin/bash
set -e

echo "Building Youtube Settings Controller..."
tsc -b

MODE="$1"

if [ "$MODE" != "development" ] && [ "$MODE" != "production" ]; then
    echo "Invalid mode: $MODE"
    exit 1
fi

if [ "$MODE" = "development" ]; then
    manifest="manifests/manifest-dev.json"
    icon="public/icon-dev.png"
else
    manifest="manifests/manifest.json"
    icon="public/icon.png"
fi

vite_configs=(
    "vite.popup.config.ts"
    "vite.background.config.ts"
    "vite.content.config.ts"
    "vite.initial-data-script.config.ts"
    "vite.navigation-data-script.config.ts"
)

for config in "${vite_configs[@]}"; do
   echo "Building Vite ($config)..."
   vite build --config ./vite-configs/$config --mode $MODE
done

cp $manifest dist/manifest.json
cp $icon dist/icon.png

echo "Build complete!"