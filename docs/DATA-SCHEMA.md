# Data Schema — LOG Sheet

Sheet `LOG` menyimpan satu row per entry. Column definisi & semantik.

---

## Columns (16 total)

| # | Column | Type | Source | Description |
|---|---|---|---|---|
| 1 | `ID` | string | Server generated | Unique ID format: `D92A-YYYYMMDD-HHMMSS`. Digunakan untuk update/delete lookup. |
| 2 | `Timestamp` | datetime | Server generated | Actual wall-clock time when SAVE ditekan. |
| 3 | `Date` | string (`YYYY-MM-DD`) | Client input | Production date yang operator pilih (may differ from Timestamp if backfilling). |
| 4 | `Operator` | string | Client input | Nama operator (dari dropdown). |
| 5 | `Shift` | string | Client input | `Shift A` / `Shift B` / `Shift C`. |
| 6 | `Changeover` | string | Client input | `YES` / `NO`. Kalau YES, `c` biasa naik ke 2 (setup after body model change). |
| 7 | `ProdPlan` | number | Client input | Bilangan door mirror yang dijadualkan (pcs). |
| 8 | `b_InitialStart` | number | Client input | Count kali initial start (default 1 per shift). |
| 9 | `c_AfterBodyFitting` | number | Client input | Count kali start selepas body fitting (1 normal, 2 kalau changeover). |
| 10 | `d_AfterBreak` | number | Client input | Count kali start selepas rehat. |
| 11 | `e_Idling` | number | Client input | Count kali idling event. |
| 12 | `f_Replacement` | number | Client input | Count kali cartridge/nozzle replacement. |
| 13 | `g_PurgingOnly` | number | Client input | Count kali purging only. |
| 14 | `PlanG` | number | Server computed | = `ProdPlan × 48g` (weight per pcs). |
| 15 | `TotalG` | number | Server computed | Total hotmelt consumed in gram. Formula di bawah. |
| 16 | `TotalKg` | number | Server computed | = `TotalG / 1000`. Untuk dashboard chart. |

---

## Total Formula

Server (Apps Script) mengira nilai berikut supaya konsisten regardless of client:

```
TotalG = PlanG
       + b × 300
       + c × 200
       + d × 200
       + e × 60
       + f × 58
       + g × 200
```

Weights per event (in gram):

| Event | Weight | Reason |
|---|---|---|
| `plan` (a) | 48 g/pcs | Berat hotmelt untuk 1 door mirror |
| `b` INITIAL START | 300 g | Purge besar untuk startup |
| `c` AFTER BODY FITTING | 200 g | Purge medium |
| `d` AFTER BREAK | 200 g | Purge medium |
| `e` IDLING | 60 g | Small drip loss |
| `f` REPLACEMENT | 58 g | Small purge |
| `g` PURGING ONLY | 200 g | Full purge cycle |

---

## Header Row Style

Row 1 (auto-created on first entry):
- Background: `#11202E`
- Font: bold white
- Frozen: yes

---

## Sample Data

```
ID                        | Timestamp             | Date       | Operator | Shift   | Changeover | ProdPlan | b | c | d | e | f | g | PlanG  | TotalG | TotalKg
D92A-20260706-114523      | 2026-07-06 11:45:23  | 2026-07-06 | AHMAD    | Shift A | YES        | 8000    | 1 | 2 | 1 | 0 | 3 | 1 | 384000 | 385274 | 385.274
D92A-20260706-153012      | 2026-07-06 15:30:12  | 2026-07-06 | ROSLI    | Shift B | NO         | 7600    | 1 | 1 | 2 | 1 | 2 | 0 | 364800 | 366076 | 366.076
```

---

## Data Integrity Notes

- **ID uniqueness** — deterministik dari timestamp (second precision). Kalau 2 SAVE dalam saat yang sama, akan collide — jarang berlaku dalam practice.
- **Timestamp vs Date** — Timestamp untuk audit trail (bila entry masuk), Date untuk grouping/report (production date yang boleh backfill).
- **Server-side compute** — All totals dikira server, bukan client. Kalau operator ubah UI value pun, sheet tetap simpan value yang correct.
- **Edit preserves ID + Timestamp** — Bila edit, hanya columns 3-16 di-overwrite. `ID` dan `Timestamp` original kekal (audit trail: bila entry dicipta pertama kali).

---

## Extending the Schema

Nak add column baru? Ikut steps ni:

1. **Code.gs** — tambah dalam `HEADERS` array
2. **Code.gs** — update `createRecord()` dan `updateRecord()` untuk populate column baru
3. **index.html** — update payload dalam SAVE / Edit handler
4. **index.html** — update `refreshHistory()` mapping untuk baca column baru
5. Redeploy Apps Script (New version!)

Contoh: nak add `Notes` column:
```js
// Code.gs
const HEADERS = [...previous..., 'Notes'];
// createRecord
sh.appendRow([..., data.notes || '']);
```
```html
<!-- index.html -->
<textarea id="notes" placeholder="Any issues to note?"></textarea>
```
```js
// index.html save handler
const payload = {..., notes: $('notes').value};
```
