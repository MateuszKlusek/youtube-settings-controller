# YouTube Settings Controller

A Chrome extension that automatically controls YouTube's audio track settings by selecting the default audio track for videos. It provides a multilanguage support.

## Overview

This extension automatically manages YouTube video audio tracks by:

- Detecting when a YouTube video is loaded
- Extracting audio track information from the video data
- Automatically opening the settings menu and selecting the default audio track
- Providing logging capabilities for debugging and monitoring

## Installation

### From Source

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd youtube-settings-controller
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build:dev
   # or
   npm run build:staging
   # or
   npm run build:prod
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## Development

### Prerequisites

- Node.js
- npm

### Available Scripts

- `dev` - Start development server for extension popup with hot reload
- `build:dev` - Build for development
- `build:staging` - Build for staging
- `build:prod` - Build for production
- `bump:release:patch` - Bump patch version
- `bump:release:minor` - Bump minor version
- `bump:release:major` - Bump major version

### Development Workflow

1. Make changes to the source files
2. Run `dev` for popup development
3. Run `build:dev` to build dist files for development
4. Run `build:staging` to build dist files for staging
5. Run `build:prod` to build dist files for production
6. Reload the extension in Chrome to test changes

## Architecture

### Project Structure

```
├── src/
│   ├── background.ts          # Background service worker
│   ├── content.ts             # Content script (runs on YouTube pages)
│   ├── components/
│   │   └── App.tsx            # Popup UI component
│   ├── lib/
│   │   ├── execution.ts       # Sequence execution logic
│   │   └── ...
│   ├── steps.ts               # UI interaction steps
│   └── types/
│       └── core.ts            # TypeScript type definitions
├── scripts/
│   ├── initial-data.ts        # Injected script for initial data
│   └── navigation-data.ts     # Injected script for navigation data
├── vite-configs/              # Vite configuration files
└── dist/                      # Built extension files
```

## Usage

1. **Enable the Extension**: Click the extension icon and toggle "Extension enabled" to ON
2. **Navigate to YouTube**: Visit any YouTube video page with a `/watch?v=` url
3. **Automatic Action**: The extension will automatically select the default audio track if multiple tracks are available
4. **Download Logs**: Click "Download logs" in the popup to export all logged actions as JSON

## Permissions

The extension requires the following permissions:

- `storage` - To store extension settings and logs
- `downloads` - To download log files
- `https://www.youtube.com/*` - To run on YouTube pages

## Technical Details

- **Manifest Version**: 3
- **Framework**: React
- **Build Tool**: Vite with Rollup
- **Language**: TypeScript
- **Styling**: Mantine UI with Tailwind CSS

## Logging

The extension maintains detailed logs of all actions:

- Logs are stored in Chrome local storage
- Maximum 100 latest entries per context ID
- Logs include:
  - Video ID
  - Action types
  - Payloads
  - Timestamps
  - Extension version

Logs can be downloaded as JSON files for analysis and debugging.

## Roadmap

- [ ] - implement a default audio track control for youtube shorts
- [ ] - implement a default audio track control for youtube thumbnail preview

## License

MIT License

[![Version](https://img.shields.io/badge/version-0.3.4-blue.svg)](https://github.com/mateuszklusek/youtube-settings-controller/releases/tag/v0.3.4)
