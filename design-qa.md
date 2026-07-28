# Navbar vertical demo design QA

- Source visual truth: `C:/Users/zx/AppData/Local/Temp/codex-clipboard-2b72f77e-27fb-4ea1-b0ab-25ffb9214836.png`
- Source pixels: 874 × 608
- Implementation: `apps/docs/registry/examples/navbar-vertical.tsx`
- Implementation screenshot: unavailable by user request; browser preview was not reopened after the final revision
- Intended CSS frame: 672 × 440 at 1× density
- State: expanded vertical navigation

## Full-view comparison evidence

The source screenshot showed an oversized 256px sidebar inside a roughly 768px preview, sparse main content, excessive paragraph/list spacing, a forced internal scrollbar, and a full-width collapse control occupying the footer. The revision narrows the demo sidebar to 208px, uses a 672 × 440 frame, resets list and prose spacing, replaces the sparse two-cell area with a compact metric strip and recent-project rows, and moves the collapse control to the sidebar divider.

## Focused region comparison evidence

The navigation rail and collapse control were the focused regions. Source evidence showed large vertical gaps between items and an isolated bottom control. Code-level fixes reset `ul`/`li` margins and padding, isolate the demo from prose typography, and position the 24px collapse control at the right edge of the rail. A final rendered capture was intentionally not taken after the user asked not to open the browser.

## Findings

- [P2] Final visual confirmation unavailable
  - Location: vertical Navbar documentation demo.
  - Evidence: the source screenshot is available, but no post-fix implementation screenshot was captured.
  - Impact: exact rendered proportions and clipping cannot be signed off visually.
  - Fix: user reviews the running local preview and reports any remaining proportion issue.

## Comparison history

1. Earlier P2 findings: sidebar/main proportions were unbalanced; prose styles inflated vertical rhythm; content scrolled; collapse control was visually heavy.
2. Fixes: 208px demo rail, 672 × 440 frame, explicit list resets, `not-prose` isolation, denser main content, edge-mounted 24px collapse trigger.
3. Post-fix evidence: static typecheck and registry generation passed; rendered evidence was not captured by user request.

## Required fidelity surfaces

- Fonts and typography: existing project font stack retained; heading reduced to 20px and UI labels to 11–12px for denser hierarchy.
- Spacing and layout rhythm: adjusted as described; final rendered confirmation pending.
- Colors and visual tokens: semantic project tokens retained with no new palette.
- Image quality and asset fidelity: no raster imagery or custom assets are used; icons remain from the installed icon library.
- Copy and content: realistic dashboard metrics and project rows replace sparse placeholder content.

## Implementation checklist

- [x] Reduce demo frame and sidebar proportions.
- [x] Remove prose/list spacing leakage.
- [x] Remove forced footer treatment from the collapse control.
- [x] Increase useful information density in the main region.
- [ ] Confirm the final rendered preview visually.

final result: blocked
