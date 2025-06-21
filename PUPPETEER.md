# Puppeteer Visual Testing Setup

This project includes Puppeteer for automated visual testing and screenshot generation.

## Installation

```bash
npm install
```

## Usage

### Start Local Server
```bash
npm run serve
# Or manually: python3 -m http.server 8080
```

### Run Visual Tests
```bash
npm run visual-test
```

This will:
- Capture screenshots of all pages at mobile (375px), tablet (768px), and desktop (1440px) viewports
- Test mobile menu functionality on mobile viewport
- Save all screenshots to `.screenshots/` directory

### Test Puppeteer Installation
```bash
npm run test-puppeteer
```

## Scripts

### visual-test.js
Main visual testing script that captures screenshots of all pages at different viewports.

Configuration:
- **Pages**: index, company, blog, terms, privacy, feedback
- **Viewports**: 
  - Mobile: 375x667 @2x
  - Tablet: 768x1024 @2x  
  - Desktop: 1440x900 @1x
- **Output**: `.screenshots/` directory

### test-puppeteer.js
Simple test script to verify Puppeteer installation and basic functionality.

## Screenshot Naming Convention

- `[page]-[viewport].png` - Full page screenshots (e.g., `index-mobile.png`)
- `[page]-mobile-menu.png` - Mobile menu open state (e.g., `company-mobile-menu.png`)

## Troubleshooting

### Chrome Not Found
If you see "Could not find Chrome", run:
```bash
npx puppeteer browsers install chrome
```

### Permission Issues
On some systems, you may need to add sandbox flags:
```javascript
browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

### Port Already in Use
If port 8080 is busy, change it in both:
1. The serve command: `python3 -m http.server [NEW_PORT]`
2. The baseUrl in visual-test.js: `http://localhost:[NEW_PORT]/docs/`