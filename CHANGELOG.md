# Changelog

## 1.0.0 — 2026-02-18

Initial release.

### Features

- **Description List** (`<dl>`) container block with default DT + DD template
- **Description Term** (`<dt>`) block with rich text editing
- **Description Details** (`<dd>`) block with rich text editing, multiple per term
- Enter key flow: DT → DD → DD; empty DD → new DT
- Backspace on empty DT/DD removes the block; empty DL is cleaned up automatically
- Tab / Shift+Tab to transform between DT and DD (cursor at start of line)
- Block toolbar "Transform to" between DT and DD
- Auto-focus first DT when creating a new description list
- Focus lands at end of line when navigating after deletion
- Color, typography, and spacing support via block inspector
- Minimal default styles (bold terms, indented descriptions, visual grouping)
- 65 unit tests across 8 test suites
