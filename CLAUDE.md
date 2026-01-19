# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **nhoj.com**, a personal portfolio website for John Markos O'Neill. It's a static site with no build system—pure HTML, CSS, and vanilla JavaScript deployed directly to GitHub Pages.

## Development

No build, test, or lint commands. Simply edit HTML/CSS/JS files and push to `main` branch for deployment.

**Local preview:** Open any HTML file directly in a browser.

## Architecture

- **`index.html`** - Main landing page with links to all sections
- **`my-code/`** - Tools written by John (human-authored)
- **`ai-code/`** - Tools built with Claude AI assistance
- **`pages/`** - Standalone pages (reports, articles)
- **`news/`** - Redirect to external blog

## Design System

The site uses a GitHub-inspired dark terminal aesthetic:
- **Font:** JetBrains Mono (via Google Fonts CDN)
- **Colors:** Dark background (#0d1117), subtle borders, minimal palette
- **Style:** Monospace, CLI-like appearance, mobile-responsive

When creating or modifying pages, maintain this consistent visual style across all HTML files.

## External Dependencies

- Google Fonts (JetBrains Mono)
- jQuery (used in some tools, loaded via CDN)

No npm packages or local dependencies.
