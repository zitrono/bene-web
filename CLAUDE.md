# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IMPORTANT: This is a template website with intentional placeholder content.**

This is the Beneficious company website - a static HTML/CSS/JavaScript site hosted on GitHub Pages. Beneficious is the company that develops Ralph, an AI-native private equity platform that transforms unstructured PE data into AI-discoverable intelligence.

The website recently underwent a complete redesign with a jace.ai-inspired dark theme, replacing all content with placeholder text while maintaining the exact visual structure.

**IMPORTANT: The original reference site is jace.ai - we need to maintain FULL PARITY with their design, functionality, and behavior across all viewports and interactions (desktop, tablet, mobile).**

### Template Site Status
- **All content is placeholder** - "Hero Product" instead of actual product names
- **Links use href="#"** - This is intentional for template purposes
- **Forms don't submit** - Template behavior, not production functionality
- **Generic testimonials** - "User Name" placeholders are expected
- **Development alerts** - JavaScript alerts for template demonstration
- **Missing images** - favicon.png, og-image.png are not needed for template
- **Branding mixing** - "Hero" vs "Beneficious" is intentional template design

When performing code reviews or checkups, these placeholder elements should NOT be flagged as issues since this is a template site, not a production website.

## Development Commands

### Local Development Server
```bash
# Python (recommended)
python3 -m http.server 8080

# Alternative: VS Code Live Server extension
# Right-click on index.html → "Open with Live Server"
```

### Testing Changes
```bash
# No build process - changes are immediate
# Simply refresh browser after editing files

# Test responsive design in browser DevTools
# Mobile: 375px width
# Tablet: 768px width  
# Desktop: 1440px width
```

### Visual Testing with Puppeteer MCP
```bash
# Basic visual check
"Navigate to http://localhost:8080 and screenshot"

# Responsive testing
"Screenshot http://localhost:8080 at 375px, 768px, and 1440px widths"

# Test interactions
"Navigate to http://localhost:8080, click the mobile menu, and screenshot"

# Error detection
"Navigate to http://localhost:8080, open console, interact with all buttons, report any JavaScript errors"

# Performance testing
"Measure page load time and first contentful paint for http://localhost:8080"
"Check performance metrics and lighthouse scores"

# Accessibility testing
"Test keyboard navigation and highlight focus path"
"Apply color blindness filters and screenshot"

# Visual regression testing
"Screenshot all main pages and compare with previous version"
```

### Deployment
```bash
# Changes deploy automatically via GitHub Pages
git add -A docs/
git commit -m "Description of changes"
git push origin main

# Site updates at beneficious.com within ~5 minutes
```

## Architecture & Key Files

### Site Structure
- **docs/** - GitHub Pages root directory (all website files must be here)
  - **index.html** - Homepage with hero, features, pricing sections
  - **assets/css/styles.css** - All styling (dark theme, Geist font)
  - **assets/js/main.js** - Interactions (mobile menu, pricing toggle, cookie banner)
  - **CNAME** - Custom domain configuration (beneficious.com)
- **.screenshots/** - Visual testing artifacts (create as needed)
  - **baseline/** - Reference screenshots
  - **current/** - Latest test results
  - **diffs/** - Visual differences
- **.claude/commands/** - Custom slash commands for repeated workflows

### Design System
- **Colors**: Background #282828, Yellow accent #ffdc61, Green #10b981
- **Font**: Geist (loaded from Vercel CDN)
- **Breakpoints**: Mobile 768px, Desktop 1440px
- **Components**: Cookie banner, mobile hamburger menu, pricing toggle

### JavaScript Features
- Mobile menu toggle with outside-click handling
- Pricing toggle (yearly/monthly)
- Cookie consent management (localStorage)
- Smooth scrolling for anchor links
- Intersection Observer for fade-in animations
- Form validation

## Business Context

Ralph (the product by Beneficious) is an AI-native PE platform using Multi-agent architecture with Model Context Protocol (MCP). Key claims:
- 70% reduction in due diligence time
- Targets $11 trillion private equity industry
- Transforms screenshots/PDFs into searchable intelligence

See `beneficious-ralph-business-doc.md` for comprehensive business details with AI maintenance instructions.

## Visual Development Workflow

### Design-to-Code Pattern
When implementing new designs or updating existing ones:
1. Provide visual target (mockup/screenshot)
2. Implement the HTML/CSS
3. Use Puppeteer to screenshot the result
4. Iterate based on visual differences
5. Test at all breakpoints (375px, 768px, 1440px)

### Visual Regression Testing
Before pushing changes:
```bash
# Screenshot current live site as baseline
"Navigate to https://beneficious.com and screenshot all pages, save to .screenshots/baseline/"

# After changes, compare local version
"Navigate to http://localhost:8080 and screenshot all pages, save to .screenshots/current/, compare with baseline"
```

### Git Workflow with Visual Proof
```bash
# Before committing
"Screenshot all changed pages and save to .screenshots/[branch-name]/"
"Include visual summary in commit message"

# For pull requests
"Create side-by-side comparison of baseline vs changes"
"Generate visual diff report for PR description"
```

### Multi-Stage Development Pattern
1. **Structure**: Create HTML → Screenshot raw structure
2. **Style**: Add CSS → Screenshot styled version
3. **Enhance**: Add JavaScript → Test interactions and screenshot
4. **Optimize**: Check performance → Generate metrics report

## Common Tasks

### Adding a New Page
1. Create HTML file in docs/ directory
2. Copy navigation and footer from existing page
3. Update active nav state in new page
4. Test all navigation links work
5. Visual test: "Screenshot new page at all breakpoints and verify styling matches"

### Updating Content
- All text is placeholder content ("Hero Product" instead of actual product name)
- Maintain generic terminology when updating
- Keep dark theme aesthetic consistent

### Modifying Styles
- All styles in single `assets/css/styles.css` file
- Use CSS variables for consistency
- Test mobile responsiveness for any layout changes
- Visual test: "Screenshot before/after at all breakpoints to verify changes"

### Testing Cookie Banner
```bash
"Navigate to http://localhost:8080, clear localStorage, refresh, and screenshot cookie banner"
"Click Accept button and verify banner disappears"
"Verify cookie preference is saved in localStorage"
```

### Testing Interactive Elements
```bash
# Pricing toggle
"Navigate to pricing section, click monthly/yearly toggle, screenshot each state"

# Mobile menu
"Set viewport to 375px, click hamburger menu, screenshot open/closed states"

# Form validation
"Navigate to feedback page, submit empty form, screenshot validation errors"

# Animation testing
"Test dropdown animation: screenshot closed, trigger open, capture 5 frames during transition, screenshot open"
```

### iOS Testing
```bash
# Note: Use screenshots instead of video for easier analysis
# Basic iOS simulator testing
"Open http://localhost:8080 in iOS simulator and take screenshot"

# Test mobile interactions with Puppeteer (recommended)
"Navigate to http://localhost:8080 with 390x844 viewport (iPhone 14 Pro), test mobile menu functionality"

# iOS-specific viewport testing
"Test at iPhone SE (375x667), iPhone 14 (390x844), and iPad (768x1024) viewports"
```

### Custom Slash Commands
Create reusable testing commands in `.claude/commands/`:

**visual-test.md**:
```markdown
Perform visual regression testing:
1. Navigate to $ARGUMENTS
2. Screenshot at standard breakpoints (375, 768, 1024, 1440)
3. Save with timestamp: screenshot_[width]_[timestamp].png
4. Compare with previous version if exists
5. Report any visual differences
```

Usage: `/visual-test http://localhost:8080`

## Important Notes

- **No build process** - This is pure HTML/CSS/JS
- **No dependencies** - No package.json or node_modules
- **GitHub Pages** - Deploys from docs/ folder automatically
- **Custom domain** - CNAME must contain "beneficious.com"
- **Placeholder content** - Site uses generic text, not actual product details
- **Visual TDD** - Use Puppeteer MCP for screenshot-driven development
- **Breakpoints** - Always test at 375px (mobile), 768px (tablet), 1440px (desktop)

## Puppeteer MCP Integration

This project benefits from visual Test-Driven Development using Puppeteer MCP. Key patterns:

1. **Before making changes**: Screenshot current state as baseline
2. **During development**: Continuously screenshot to verify changes
3. **Before committing**: Run visual regression tests across all pages
4. **After deployment**: Verify live site matches local version

### Troubleshooting Puppeteer Issues
- **Blank screenshots**: Ensure page fully loaded with `waitUntil: 'networkidle0'`
- **Connection issues**: Try `127.0.0.1` instead of `localhost`
- **Viewport problems**: Explicitly set viewport before screenshots
- **Missing Chrome**: Run `npx puppeteer browsers install chrome`

### Documentation Generation
```bash
"Document this component: screenshot all states, create visual state diagram, generate README with embedded screenshots"
```

See `Puppeteer-mcp.md` for detailed visual testing workflows and advanced techniques.

## Workspace Rules
- never change POM without my explicit permission