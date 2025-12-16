# Claude Code - Developer Workflow Guide

This document contains important reminders and workflows for maintaining this project with Claude Code.

## 🚨 CRITICAL: Pre-Commit Checklist

**ALWAYS** complete these steps before making any git commit:

### 1. Update ANALYSIS.md
- [ ] Document what was completed in this commit
- [ ] Move completed bugs from "Known Bugs" to "✅ Completed Work"
- [ ] Add new commit section with date and bullet points
- [ ] Update any relevant improvement suggestions if they were addressed

### 2. Rebuild if Needed
- [ ] Run `npm run build` if any JavaScript changes were made
- [ ] Verify build output size (should be ~7kb minified)
- [ ] Check for any build errors or warnings

### 3. Test Changes
- [ ] Verify the application works in the browser
- [ ] Test any modified functionality
- [ ] Check console for errors

### 4. Review Git Status
- [ ] Review all staged files with `git status`
- [ ] Check `git diff` for unintended changes
- [ ] Ensure no sensitive data is being committed

### 5. Write Clear Commit Message
- [ ] Use conventional commit format: `feat:`, `fix:`, `refactor:`, etc.
- [ ] Include detailed description of what changed
- [ ] Add Claude Code attribution footer

## 📋 Standard Workflow

### Making Code Changes

1. **Plan**: Use TodoWrite to track multi-step tasks
2. **Code**: Make changes to source files
3. **Build**: Run `npm run build` for JS changes
4. **Update Docs**: Update ANALYSIS.md with changes
5. **Commit**: Follow pre-commit checklist above
6. **Push**: Push to remote repository

### Build System

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build

# Clean build artifacts
npm run clean
```

### Project Structure

```
color-pattern-grid/
├── src/
│   └── app.js          # Main application logic (minified to dist/)
├── dist/
│   ├── app.min.js      # Built/minified JavaScript
│   └── app.min.js.map  # Source maps
├── index.html          # Main HTML file (loads dist/app.min.js)
├── ANALYSIS.md         # ⚠️ UPDATE BEFORE EVERY COMMIT
├── CLAUDE.md           # This file
├── package.json        # Dependencies & scripts
├── build.js            # esbuild configuration
└── vercel.json         # Vercel deployment config
```

## 🎯 Key Reminders

### Color System
- **Pattern colors**: 7 colors (silver-gray, deep-purple, lime-green, pale-yellow, bright-blue, light-cyan, magenta)
- **All colors (with white)**: 8 colors total in `allColors` array
- **White**: Used for sandbox initialization only, not counted in pattern validation
- **TARGET_COUNT**: 12 (based on 84 squares ÷ 7 colors)

### Important Functions
- `initializePatterns()`: Generates and renders all 4 pattern types
- `initializeSandbox()`: Renders white squares in sandbox on load
- `initializeColorCustomization()`: Binds hex inputs to CSS variables
- `renderPattern(patternId, pattern)`: Renders a 2D array to grid DOM
- `testColorCounts(patternId)`: Validates color balance

### Build Configuration
- **Bundler**: esbuild (fast, lightweight)
- **Format**: IIFE (Immediately Invoked Function Expression)
- **Target**: ES2020
- **Output**: Minified with source maps
- **Vercel**: Auto-builds on deploy with `npm install && npm run build`

## 📝 Commit Message Template

```
<type>: <short description>

<detailed description of changes>
- Bullet point 1
- Bullet point 2
- Bullet point 3

<optional: breaking changes, notes, etc.>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Commit Types
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

## 🔧 Common Tasks

### Adding a New Color
1. Add CSS class to `index.html` (`.your-color { background-color: #hex; }`)
2. Add color name to `colors` array in `src/app.js`
3. Update `TARGET_COUNT` calculation if needed
4. Rebuild: `npm run build`
5. Update ANALYSIS.md
6. Commit changes

### Adding a New Pattern Algorithm
1. Create `generateYourPattern()` function in `src/app.js`
2. Add pattern type to `PATTERN_TYPES` constant
3. Add to `patterns` object
4. Call in `initializePatterns()`
5. Add UI section in `index.html`
6. Rebuild: `npm run build`
7. Update ANALYSIS.md
8. Commit changes

### Fixing a Bug
1. Identify bug location and cause
2. Update ANALYSIS.md - mark bug as "In Progress"
3. Implement fix
4. Test thoroughly
5. Rebuild if needed: `npm run build`
6. Update ANALYSIS.md - move to "✅ Completed Work"
7. Commit with clear description
8. Push changes

## 🌐 Deployment

### Vercel
- **Auto-deploys** on push to `main` branch
- Build command: `npm install && npm run build`
- Output directory: `.` (root)
- Serves: `index.html` and `dist/app.min.js`

### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🎨 Code Style Guidelines

- Use ES6+ features (const/let, arrow functions, template literals)
- Keep functions small and focused (single responsibility)
- Use descriptive variable names
- Comment complex algorithms
- Maintain consistent indentation (2 spaces)
- Add JSDoc comments for exported functions

## 🐛 Debugging

### Browser Console
- Check for JavaScript errors
- Use `console.log()` for debugging (remove before commit)
- Test color picker positioning edge cases

### Build Issues
- Clear `dist/` and rebuild
- Check `build.js` for configuration errors
- Verify `package.json` scripts

### Git Issues
- Check `.gitignore` for accidentally ignored files
- Use `git status` to see what's being committed
- Use `git diff` to review changes

---

**Remember**: Always update ANALYSIS.md before committing! 🚨
