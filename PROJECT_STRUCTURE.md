# Project Structure

```
/bene
├── docs/                    # GitHub Pages website (production)
│   ├── index.html          # Main landing page
│   ├── styles.css          # Website styles
│   ├── script.js           # JavaScript functionality
│   ├── bene logo.png       # Company logo
│   ├── images/             # Image assets
│   ├── svg/                # SVG graphics
│   ├── privacy-policy.html # Legal pages
│   ├── terms-of-service.html
│   └── CNAME               # Custom domain configuration
│
├── dev/                     # Development resources
│   ├── documentation/       # Project documentation
│   │   ├── concept.md
│   │   ├── graphics-improvements*.md
│   │   └── illustration-*.md
│   │
│   ├── forms/              # Form handling development
│   │   ├── FORMS_*.md
│   │   ├── create_forms.py
│   │   ├── form-handler.js
│   │   └── test-forms.html
│   │
│   ├── graphics/           # Graphics source files
│   │   ├── ralph-*.svg
│   │   └── svg 1.zip
│   │
│   └── scripts/            # Build and utility scripts
│
├── README.md               # Main project documentation
├── PROJECT_STRUCTURE.md    # This file
├── .gitignore             # Git ignore rules
└── venv/                  # Python virtual environment
```

## Workflow

1. **Development**: Work on files in the appropriate `dev/` subdirectory
2. **Testing**: Test changes locally
3. **Deployment**: Copy production-ready files to `docs/`
4. **Commit**: Push changes to GitHub, which automatically deploys via GitHub Pages

## Important Notes

- The `docs/` directory contains the live website
- Never edit files directly in `docs/` during development
- The original `bene logo.png` is kept in root for reference
- Python virtual environment (`venv/`) is excluded from version control
