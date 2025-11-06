#!/bin/bash
set -e

echo "Building Youtube Settings Controller..."
tsc -b

MODE="$1"

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

echo "Running postbuild copy..."
npm run postbuild:copy

echo "Build complete!"