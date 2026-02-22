# Kore Email Builder — Cleanup & Publish Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strip ~170 Cursor debug artifacts from the repo, resolve dead code, verify the build passes, write a clean README, then deploy to Vercel and push to GitHub.

**Architecture:** Brownfield cleanup — no feature changes, no refactors. Delete trash, fix naming issues, verify tests + build still pass, then publish.

**Tech Stack:** React 18, Vite 6, TypeScript, Radix UI, dnd-kit, Tailwind, Vitest, Vercel

---

## PHASE 1 — Delete Cursor Debris

### Task 1: Delete all `.md` debug logs from `src/` root

**Files:**
- Delete: 92 `.md` files in `src/` root (everything except nothing — there is no good .md to keep there)

**Step 1: Run the delete**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
find src -maxdepth 1 -name "*.md" -delete
```

**Step 2: Verify they're gone**

```bash
find src -maxdepth 1 -name "*.md" | wc -l
```
Expected: `0`

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove Cursor AI debug logs from src root"
```

---

### Task 2: Delete fix/utility scripts from `src/` root

**Files:**
- Delete: `src/APPLY_TYPOGRAPHY_FIX.sh`
- Delete: `src/apply-typography-fix.js`
- Delete: `src/fix-typography-all.py`
- Delete: `src/.DS_Store`

**Step 1: Delete scripts**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
rm -f "src/APPLY_TYPOGRAPHY_FIX.sh" "src/apply-typography-fix.js" "src/fix-typography-all.py" "src/.DS_Store"
```

**Step 2: Verify**

```bash
ls src/*.sh src/*.js src/*.py 2>/dev/null | wc -l
```
Expected: `0`

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove one-off fix scripts from src root"
```

---

### Task 3: Delete entire `src/docs/` tree (Cursor logs)

The `src/docs/` folder contains 42 debug/session logs, archive subdirs, and forensic reports — none of which are end-user documentation. Real docs will live at the project root as a single `README.md`.

**Step 1: Delete**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
rm -rf src/docs/
```

**Step 2: Verify**

```bash
ls src/docs 2>/dev/null || echo "gone"
```
Expected: `gone`

**Step 3: Check nothing imports from src/docs/**

```bash
grep -r "from.*src/docs\|from.*\.\/docs" src --include="*.ts" --include="*.tsx" | wc -l
```
Expected: `0`

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove src/docs Cursor session logs"
```

---

### Task 4: Delete markdown logs from `src/scripts/`

**Files:**
- Delete: `src/scripts/BULK_UPDATE_GUIDE.md`
- Delete: `src/scripts/CALCULATED_TOKENS.md`
- Delete: `src/scripts/COMPLETE_TOKENS_CALCULATION.md`
- Delete: `src/scripts/complete-remaining-themes.md`

**Step 1: Delete**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
find src/scripts -name "*.md" -delete
```

**Step 2: Verify scripts folder only has real files**

```bash
ls src/scripts/
```
Expected: only `.ts` and `.json` files remain

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove markdown logs from src/scripts"
```

---

### Task 5: Delete miscellaneous `.md` files in subdirs

**Files:**
- Delete: `src/components/email-blocks/patterns/README.md`
- Delete: `src/guidelines/Guidelines.md` (and folder if empty after)

**Step 1: Delete**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
rm -f "src/components/email-blocks/patterns/README.md"
rm -f "src/guidelines/Guidelines.md"
rmdir src/guidelines 2>/dev/null || true
```

**Step 2: Verify zero .md files remain anywhere in src/**

```bash
find src -name "*.md" | sort
```
Expected: empty output

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove remaining markdown files from src subtree"
```

---

## PHASE 2 — Dead Code & Naming

### Task 6: Rename `PropertiesPanel-REFACTORED.tsx` to `PropertiesPanel.tsx`

The active properties panel has a leftover `-REFACTORED` suffix. It's imported directly in `App.tsx`.

**Files:**
- Rename: `src/components/PropertiesPanel-REFACTORED.tsx` → `src/components/PropertiesPanel.tsx`
- Modify: `src/App.tsx` (update import)

**Step 1: Rename the file**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
mv "src/components/PropertiesPanel-REFACTORED.tsx" "src/components/PropertiesPanel.tsx"
```

**Step 2: Update the import in App.tsx**

Find the line:
```ts
import { PropertiesPanel, type ContentBlock, type ContentBlockType } from "./components/PropertiesPanel-REFACTORED";
```
Replace with:
```ts
import { PropertiesPanel, type ContentBlock, type ContentBlockType } from "./components/PropertiesPanel";
```

**Step 3: Check for any other references**

```bash
grep -r "PropertiesPanel-REFACTORED" src --include="*.ts" --include="*.tsx"
```
Expected: no output

**Step 4: Run the dev build to verify no import errors**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
npm run build 2>&1 | tail -20
```
Expected: build succeeds (exit 0)

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: rename PropertiesPanel-REFACTORED to PropertiesPanel"
```

---

### Task 7: Remove `BLOCK_COMPONENT_TEMPLATE.tsx` (unused template)

This file is not imported anywhere — it's developer scaffolding documentation as a `.tsx` file.

**Step 1: Confirm it's unused**

```bash
grep -r "BLOCK_COMPONENT_TEMPLATE" src --include="*.ts" --include="*.tsx"
```
Expected: no output (or only the file itself)

**Step 2: Delete**

```bash
rm "src/components/email-blocks/BLOCK_COMPONENT_TEMPLATE.tsx"
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused block component template file"
```

---

### Task 8: Check and handle `src/content/template-copy.ts`

**Step 1: Check if it's imported anywhere**

```bash
grep -r "template-copy" src --include="*.ts" --include="*.tsx"
```

**Step 2a: If unused — delete it**

```bash
rm "src/content/template-copy.ts"
rmdir src/content 2>/dev/null || true
git add -A
git commit -m "chore: remove unused template-copy content file"
```

**Step 2b: If used — leave it, no action needed**

---

## PHASE 3 — Verify App Still Works

### Task 9: Run tests

**Step 1: Run the test suite**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
npm test 2>&1
```
Expected: all tests pass

**Step 2: If tests fail — read the error and fix the import/path causing it**

Common failure: a test imports from a deleted file. Fix the import to point to the correct path.

---

### Task 10: Run production build

**Step 1: Build**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
npm run build 2>&1
```
Expected: `build/` directory updated, exit code 0, no TypeScript errors

**Step 2: If build fails — read TS errors and fix (usually broken imports from renames)**

**Step 3: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve build errors after cleanup"
```

---

## PHASE 4 — Project Root Hygiene

### Task 11: Create a clean `.gitignore`

**Files:**
- Create/update: `.gitignore` at project root

**Step 1: Write the gitignore**

```
node_modules/
build/
dist/
.DS_Store
*.local
.env
.env.*
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add/update .gitignore"
```

---

### Task 12: Write a clean project-level `README.md`

The current `README.md` at the root is minimal (8 lines). Replace it with a proper public-facing README.

**Files:**
- Modify: `README.md` (project root)

**Step 1: Write README**

```markdown
# Kore Email Builder

A drag-and-drop email template builder for creating production-ready HTML emails. Built for the Kore.ai design system.

## Features

- Drag-and-drop block composer (Header, CTA, Text, Divider, Image, Code, Stats, Timeline, and more)
- Colorful mode with per-block theme overrides
- Live HTML preview and copy-to-clipboard export
- Theme system with typography, color tokens, and preset styles
- Dark UI with keyboard shortcuts

## Stack

React 18 · Vite · TypeScript · Radix UI · dnd-kit · Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `build/` |
| `npm test` | Run Vitest tests |

## Design Reference

Original Figma: [Kore Email Builder 0.2](https://www.figma.com/design/PSNxIgV0Wljk8gzMBGPb4q/Kore-Email-Builder-0.2)
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: write clean public README"
```

---

### Task 13: Lock down dependency versions in `package.json`

Currently all Radix UI and utility deps use `"*"` as version — dangerous for reproducible builds.

**Files:**
- Modify: `package.json`

**Step 1: Get current installed versions**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
npm ls --depth=0 2>/dev/null | grep -E "@radix|dnd-kit|clsx|lucide|motion|sonner|tailwind-merge|class-variance" | head -40
```

**Step 2: Replace `"*"` with the installed version for each dep**

Open `package.json` and for every dependency that shows `"*"`, replace it with the version shown by `npm ls`. Use the format `"^x.y.z"`.

Example:
```json
"@dnd-kit/core": "^6.3.1",
"@dnd-kit/sortable": "^8.0.0",
```

**Step 3: Run install to verify lockfile is consistent**

```bash
npm install
```

**Step 4: Run build again to confirm no version conflicts**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: pin dependency versions (replace wildcard *)"
```

---

## PHASE 5 — GitHub

### Task 14: Initialize git repo (if not already) and push to GitHub

**Step 1: Check if git is initialized**

```bash
cd "/Users/Rajaraman.A/Documents/Documents - KI01221MacBook Pro/Raja/Work/Personal Apps/Kore Email Builder 0.2"
git status
```

**Step 2: If no git repo — initialize**

```bash
git init
git add -A
git commit -m "feat: initial commit — Kore Email Builder 0.2"
```

**Step 3: Create GitHub repo and push**

```bash
gh repo create kore-email-builder --public --description "Drag-and-drop HTML email template builder for Kore.ai" --source=. --remote=origin --push
```

If repo already exists:
```bash
git remote add origin https://github.com/YOUR_USERNAME/kore-email-builder.git
git push -u origin main
```

---

## PHASE 6 — Vercel Deploy

### Task 15: Deploy to Vercel

**Step 1: Check for existing Vercel project config**

```bash
ls .vercel/ 2>/dev/null || echo "no vercel config"
```

**Step 2: Deploy**

If no existing config:
```bash
vercel --yes
```

When prompted:
- Project name: `kore-email-builder`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `build`
- Install command: `npm install`

**Step 3: Set the output dir in `vite.config.ts` if not already `build`**

Check `vite.config.ts`:
```ts
build: {
  outDir: 'build'
}
```

**Step 4: Promote to production**

```bash
vercel --prod
```

**Step 5: Confirm the URL is live**

```bash
vercel ls | head -5
```

**Step 6: Commit Vercel config**

```bash
git add .vercel/
git commit -m "chore: add Vercel deployment config"
git push
```

---

## Summary

| Phase | Tasks | Goal |
|-------|-------|------|
| 1 | 1–5 | Delete ~170 Cursor debris files |
| 2 | 6–8 | Fix naming, remove dead code |
| 3 | 9–10 | Verify tests + build pass |
| 4 | 11–13 | README, gitignore, pin deps |
| 5 | 14 | Push to GitHub |
| 6 | 15 | Deploy to Vercel |

**Estimated time:** 30–45 minutes of execution
