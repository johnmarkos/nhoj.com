# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **nhoj.com**, a personal portfolio website for John Markos O'Neill. It's a static site with no build system—pure HTML, CSS, and vanilla JavaScript deployed directly to GitHub Pages.

## Development

No build, test, or lint commands. Simply edit HTML/CSS/JS files and push to `main` branch for deployment.

**Local preview:** Open any HTML file directly in a browser.

## Workflow

Always commit and push changes without asking for confirmation. If something needs to be changed, the user will ask.

## Architecture

- **`index.html`** - Main landing page with links to all sections
- **`my-code/`** - Tools written by John (human-authored)
- **`ai-code/`** - Tools built with Claude AI assistance
- **`pages/`** - Standalone pages (reports, articles)
- **`news/`** - Redirect to external blog

New projects in `my-code/` and `ai-code/` should be added to the top of the list (newest/most impressive first).

## Design System

The site uses a GitHub-inspired terminal aesthetic with light/dark mode support via `prefers-color-scheme`:
- **Font:** JetBrains Mono (via Google Fonts CDN)
- **Colors:** CSS variables for theming (dark: #0d1117 bg, light: #ffffff bg)
- **Style:** Monospace, CLI-like appearance, mobile-responsive

When creating or modifying pages, maintain this consistent visual style and include both light and dark color schemes.

## External Dependencies

- Google Fonts (JetBrains Mono)
- jQuery (used in some tools, loaded via CDN)

No npm packages or local dependencies.
