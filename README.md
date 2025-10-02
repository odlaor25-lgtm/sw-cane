# CANE MATRIX (Apps Script Web App)

A lightweight dashboard for Thai cane price monitoring + macro signals.
Works with **Script Properties** keys:

- `BOT_CLIENT_ID`
- `ALPHAVANTAGE_API_KEY`
- `FRED_API_KEY`

## Files
- `Code.gs` – backend (doGet/doPost, API fetchers, analyzer, sheet log)
- `index.html` – UI (Matrix theme, calculator, news)
- `appsscript.json` – manifest (V8, webapp access)

## Setup
1. Create a new **Apps Script** project.
2. Add files **Code.gs**, **index.html**, **appsscript.json** (replace existing).
3. Set Script Properties (Project Settings → Script Properties):
   - `BOT_CLIENT_ID`, `ALPHAVANTAGE_API_KEY`, `FRED_API_KEY`
4. Put your Google Sheet ID in `CONFIG.SHEET_ID` (in `Code.gs`).

## Deploy
- **Deploy → New deployment → Web app**
  - Execute as: *User accessing* 
  - Who has access: *Only myself* (or as you need)
- Copy the web app URL to open the dashboard.

## GitHub with `clasp`
```bash
npm install -g @google/clasp
clasp login
clasp create --type webapp --title "CANE_MATRIX"
# paste files then:
clasp push
clasp deploy
```

## Notes
- AlphaVantage example uses `FX_DAILY USD/THB` as a proxy for THB conditions.
- FRED example uses series `DTWEXBGS` (Dollar Index) – change `seriesId` as needed.
- BOT example is a placeholder ping that confirms presence of `BOT_CLIENT_ID`.
