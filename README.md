# Nartstudio Academy

Independent learning resources for writers and visual storytellers, with guides, learning tracks and a browser-based chapter-planning worksheet.

## Pages

- `/` - Academy overview
- `/guides` and `/guides/[slug]` - practical creator guides
- `/tracks` and `/tracks/[slug]` - structured learning paths
- `/worksheet` - chapter planner with local save and text export

## Data and setup

Guide and track content is maintained in `src/lib/content.ts`. The worksheet stores plan data in this browser only; it is not uploaded or synchronized. If browser storage is unavailable or malformed, the page reports that state and remains usable for the current visit. Export creates a local text file.

```bash
npm install
npm run dev
```
