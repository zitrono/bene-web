# Claude Code + Puppeteer MCP: Web Development Best Practices

> A comprehensive guide for using Claude Code with Puppeteer MCP for visual web development workflows

## Table of Contents

1. [Introduction](#introduction)
2. [Core Concepts](#core-concepts)
3. [Setup & Configuration](#setup--configuration)
4. [Visual Development Workflow](#visual-development-workflow)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)
7. [Advanced Techniques](#advanced-techniques)
8. [Troubleshooting](#troubleshooting)
9. [Quick Reference](#quick-reference)

## Introduction

Similar to the testing workflow, you can provide Claude with visual targets. Give Claude a way to take browser screenshots (e.g., with the Puppeteer MCP server), give Claude a visual mock by copying/pasting or drag-dropping an image, ask Claude to implement the design in code, take screenshots of the result, and iterate until its result matches the mock.

This manual covers best practices for using Claude Code with Puppeteer MCP to create a visual feedback loop for web development, enabling rapid iteration and accurate implementation.

## Core Concepts

### What is Puppeteer MCP?

Puppeteer MCP is a Model Context Protocol server that leverages Puppeteer to provide robust browser automation capabilities. This server enables LLMs to navigate web pages, take screenshots, fill forms, and execute JavaScript in a real browser environment.

### Key Benefits for Solo Developers

1. **Visual Verification**: See exactly what Claude Code builds
2. **Rapid Iteration**: Screenshot → Modify → Screenshot workflow
3. **Automated Testing**: Test forms, interactions, and responsive designs
4. **Error Detection**: Catch JavaScript errors and layout issues immediately

## Setup & Configuration

### Installation Paths

```bash
# Your installation location
~/dev/mcp/Puppeteer/

# Claude Desktop config
~/Library/Application Support/Claude/claude_desktop_config.json

# Claude Code (CLI) - Added with user scope
claude mcp add --scope user puppeteer node ~/dev/mcp/Puppeteer/node_modules/@modelcontextprotocol/server-puppeteer/dist/index.js
```

### Environment Variables (Optional)

export PUPPETEER_HEADLESS=false # Visible browser export PUPPETEER_SLOWMO=250 # Slow-motion demo mode export PUPPETEER_TIMEOUT=60000 # Extended timeout

## Visual Development Workflow

### 1. Design-to-Code Pattern

Like humans, Claude's outputs tend to improve significantly with iteration. While the first version might be good, after 2-3 iterations it will typically look much better.

```bash
# Step 1: Provide visual target
claude "Here's a mockup [image]. Create an HTML page matching this design, then screenshot it"

# Step 2: Iterate based on visual feedback
claude "The header is too tall. Reduce it to 80px and screenshot again"

# Step 3: Test responsive behavior
claude "Screenshot this at 375px, 768px, and 1440px widths"
```

### 2. Test-Driven Visual Development

```bash
# Create with visual validation
claude "Create a contact form with:
- Name, email, message fields
- Submit button
- Success/error states
Navigate to localhost:8080 and screenshot each state"
```

### 3. Progressive Enhancement Loop

1. **Basic Structure**: HTML skeleton → Screenshot
2. **Styling**: Add CSS → Screenshot
3. **Interactivity**: Add JavaScript → Test & Screenshot
4. **Polish**: Animations/transitions → Record video

## Best Practices

### 1. Context Management with CLAUDE.md

CLAUDE.md is a special file that Claude Code automatically pulls into context when starting a conversation.

Create `~/dev/web/bene/CLAUDE.md`:

```markdown
# Project: Beneficious Web Platform

## Visual Standards
- Primary color: #0066CC
- Font: Inter, system-ui
- Breakpoints: 375px, 768px, 1024px, 1440px

## Puppeteer Testing Checklist
- [ ] Desktop view (1440px)
- [ ] Tablet view (768px)
- [ ] Mobile view (375px)
- [ ] Form interactions
- [ ] Error states
- [ ] Loading states

## Local Development
- Dev server: http://localhost:3000
- API: http://localhost:3001
```

### 2. Custom Slash Commands for Visual Testing

For repeated workflows—debugging loops, log analysis, etc.—store prompt templates in Markdown files within the .claude/commands folder.

Create `.claude/commands/visual-test.md`:

```markdown
Perform visual regression testing:
1. Navigate to $ARGUMENTS
2. Screenshot at standard breakpoints (375, 768, 1024, 1440)
3. Save with timestamp: screenshot_[width]_[timestamp].png
4. Compare with previous version if exists
5. Report any visual differences
```

Usage: `/visual-test http://localhost:3000/home`

### 3. Multi-Stage Visual Development

Automate feedback with Puppeteer. Claude Code can use Puppeteer to open a web page, take a screenshot, and save it.

```bash
# Stage 1: Structure
claude "Create semantic HTML for a pricing table. Screenshot the raw HTML"

# Stage 2: Style
claude "Add CSS to match our design system. Screenshot desktop and mobile"

# Stage 3: Enhance
claude "Add hover states and transitions. Record a video showing interactions"

# Stage 4: Optimize
claude "Check performance metrics and lighthouse scores"
```

### 4. Error Detection Workflow

```bash
claude "Navigate to localhost:3000, open console, interact with all buttons, 
report any JavaScript errors, and screenshot any broken states"
```

## Common Patterns

### 1. Component Development Pattern

```bash
claude "Create a reusable card component:
1. Build the HTML/CSS
2. Screenshot in isolation
3. Screenshot in a grid layout
4. Test hover/focus states
5. Verify mobile responsiveness"
```

### 2. Form Testing Pattern

Smart Form Interaction: Automate complex form submissions with dynamic field detection

```bash
claude "Test the signup form:
1. Fill with valid data → screenshot success state
2. Submit empty → screenshot validation errors
3. Submit invalid email → screenshot specific error
4. Test tab navigation → verify focus styles"
```

### 3. Cross-Browser Visual Testing

```bash
claude "Run visual tests:
1. Chrome (default)
2. Set viewport to iPhone 12 dimensions
3. Set viewport to iPad dimensions
4. Screenshot each and create comparison grid"
```

### 4. Performance-First Development

```bash
claude "Build this feature with performance checks:
1. Implement the feature
2. Screenshot initial paint
3. Measure and report CLS (Cumulative Layout Shift)
4. Screenshot fully loaded state
5. Generate lighthouse report"
```

## Advanced Techniques

### 1. Visual Regression Testing

```bash
# Save baseline
claude "Navigate to all main pages, screenshot each, save as baseline/[page].png"

# Test changes
claude "Screenshot all pages again, compare with baseline, highlight differences"
```

### 2. Animation Testing

```bash
claude "Test the dropdown animation:
1. Screenshot closed state
2. Trigger open
3. Capture 5 frames during transition
4. Screenshot open state
5. Create animation preview grid"
```

### 3. A/B Testing Visualization

```bash
claude "Create variant B of the hero section:
1. Duplicate current version
2. Apply changes
3. Screenshot both versions side-by-side
4. Add metrics overlay showing conversion areas"
```

### 4. Accessibility Testing

```bash
claude "Run accessibility audit:
1. Screenshot with normal vision
2. Apply color blindness filters and screenshot
3. Test keyboard navigation and highlight focus path
4. Screenshot with high contrast mode"
```

## Integration with Development Workflow

### 1. Git Commit with Visual Proof

```bash
claude "Before committing:
1. Screenshot all changed pages
2. Save to .screenshots/[commit-hash]/
3. Add visual summary to commit message
4. Create PR with before/after screenshots"
```

### 2. Documentation Generation

```bash
claude "Document this component:
1. Screenshot all states
2. Create visual state diagram
3. Generate README with embedded screenshots
4. Include code examples with visual output"
```

### 3. Client Presentation Mode

```bash
claude "Prepare client demo:
1. Start local server
2. Screenshot each feature in sequence
3. Create PDF with screenshots and annotations
4. Record video walkthrough of key interactions"
```

## Troubleshooting

### Common Issues

1. **Puppeteer Can't Find Chrome**
   ```bash
   # Check installed browsers
   npx puppeteer browsers list
   
   # Install if needed
   npx puppeteer browsers install chrome
   ```

2. **Screenshots Are Blank**
   - Ensure page is fully loaded: `waitUntil: 'networkidle0'`
   - Add explicit waits for dynamic content
   - Check if running in headless mode

3. **Viewport Issues**
   ```javascript
   // Ensure consistent viewport
   await page.setViewport({ width: 1440, height: 900 });
   ```

4. **Local Server Connection**
   - Verify server is running
   - Check correct port
   - Use `127.0.0.1` instead of `localhost` if needed

## Quick Reference

### Essential Commands

```bash
# Basic screenshot
"Navigate to [URL] and take a screenshot"

# Responsive testing
"Screenshot [URL] at mobile (375px), tablet (768px), and desktop (1440px)"

# Interaction testing
"Click the submit button and screenshot the result"

# Console monitoring
"Check for console errors on [URL]"

# Form testing
"Fill the form with test data and submit"

# Performance check
"Measure page load time and first contentful paint"
```

### Project Structure

```
~/dev/web/bene/
├── .claude/
│   ├── commands/
│   │   ├── visual-test.md
│   │   ├── responsive-check.md
│   │   └── performance-audit.md
│   └── CLAUDE.md
├── .screenshots/
│   ├── baseline/
│   ├── current/
│   └── diffs/
├── docs/
│   └── Puppeteer-mcp.md (this file)
└── src/
    └── [your web files]
```

## Conclusion

By integrating Puppeteer MCP with Claude Code, you transform from coding blind to having continuous visual feedback. This approach is particularly powerful for solo developers who need to verify their work quickly without complex testing setups.

Remember: Give Claude the tools to see its outputs for best results. The visual feedback loop dramatically improves both development speed and quality.

---

*Last updated: June 2025*
*For updates, check: ~/dev/web/bene/docs/Puppeteer-mcp.md*
