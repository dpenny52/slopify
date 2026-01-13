#!/bin/bash

# Download sample overlay videos from Mixkit (free, royalty-free)
# These are excluded from git due to their size

OVERLAY_DIR="public/sample-overlays"
mkdir -p "$OVERLAY_DIR"

echo "Downloading sample overlay videos..."

# Video sources from Mixkit (licensed under Mixkit License - free for commercial use)
declare -a VIDEOS=(
  "https://assets.mixkit.co/videos/47332/47332-1080.mp4|overlay-1.mp4|Blue and orange plasticine"
  "https://assets.mixkit.co/videos/47335/47335-1080.mp4|overlay-2.mp4|Green ice cream plasticine"
  "https://assets.mixkit.co/videos/47330/47330-1080.mp4|overlay-3.mp4|Pink ice cream plasticine"
  "https://assets.mixkit.co/videos/47348/47348-1080.mp4|overlay-4.mp4|Red slime with bowl"
  "https://assets.mixkit.co/videos/47331/47331-1080.mp4|overlay-5.mp4|Green ice cream squeeze"
  "https://assets.mixkit.co/videos/47325/47325-1080.mp4|overlay-6.mp4|Orange modeling clay"
  "https://assets.mixkit.co/videos/47328/47328-1080.mp4|overlay-7.mp4|Orange ice cream plasticine"
  "https://assets.mixkit.co/videos/47334/47334-1080.mp4|overlay-8.mp4|Purple ice cream plasticine"
)

for video in "${VIDEOS[@]}"; do
  IFS='|' read -r url filename description <<< "$video"
  if [ -f "$OVERLAY_DIR/$filename" ]; then
    echo "✓ $description already exists"
  else
    echo "Downloading $description..."
    curl -L -o "$OVERLAY_DIR/$filename" "$url"
    echo "✓ Downloaded $filename"
  fi
done

echo ""
echo "All overlay videos downloaded to $OVERLAY_DIR"
