# X.com Dim Theme Restore

Tampermonkey userscript that restores the blue **Dim** theme on X.com (Twitter), replacing the pure black "Lights Out" dark mode with the original blue-tinted dark theme.

## Before / After

| Lights Out (default dark) | Dim (restored)       |
| ------------------------- | -------------------- |
| `#000000` background      | `#15202B` background |
| `#E7E9EA` text            | `#F7F9F9` text       |
| `#2F3336` borders         | `#38444D` borders    |

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser
2. Click [here to install the script](../../raw/master/x-dim-theme.user.js) (or create a new script in Tampermonkey and paste the contents of `x-dim-theme.user.js`)
3. Visit [x.com](https://x.com) — the Dim theme is applied automatically

## How it works

- Detects X's dark mode via the inline `color-scheme: dark` on `<html>` (covers both Dim and Lights Out)
- Injects CSS overrides for React Native Web class names and inline styles used by X.com
- Forces the `<html>` and `<body>` background to the Dim color, and uses a `MutationObserver` to repaint the body if X resets it to black

## Compatibility

- Works on `x.com` and `twitter.com`
- Tested with Tampermonkey on Chrome, Firefox, and Edge

## License

MIT
