# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) style.

## [v2.0] — 2026-07-06
### Added
- **3-tab layout** — Usage Input, History, Report
- **History tab** — KPI cards (Entries, Total Used, Avg), filter chips (Today/Week/Month/All), search bar, refresh button
- **VIEW modal** — record detail popup with full breakdown & subtotals
- **EDIT modal** — editable form with live recalculated total, saves via `action:update` endpoint
- **Report tab** — Data Table (weekly breakdown) + Trend section
- **Trend charts** — SVG bar chart (Hotmelt by Event Type) + line chart (Daily Total)
- **Date range picker** — from/to dates for trend filtering
- **Status bar** — SYSTEM · LAST SYNC · MODE (LIVE/DEMO) · version · viewport
- Server-side `updateRecord()` endpoint in Apps Script

### Changed
- Rename Sheet name from `Records` → `LOG` (aligns with Excel workbook)
- Save flow returns server-generated ID for later edit lookup

## [v1.1] — 2026-06-25
### Fixed
- Alignment of left/right info boxes on phone (reserve label height)
- Event counter tile gap match info grid gap (10px)
- Badge overlap with title on very narrow screens

## [v1.0] — 2026-06-20
### Added
- Initial release
- HMI-style dark theme with cyan/green/amber palette
- 6 event counter tiles (b/c/d/e/f/g) with +/− buttons
- Operator dropdown, Shift toggle, Changeover switch
- Real-time total calculation (gram + kg)
- SAVE (POST to Apps Script) + RESET (with confirm)
- Session log (client-side only in demo mode)
- Fluid responsive layout: 2-up phone → 3-up tablet/desktop
- Google Apps Script backend with `Records` sheet
