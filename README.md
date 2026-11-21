# Commute Analytics & Location Intelligence

A web platform for commercial real estate site selection, workforce mobility analysis, and transit catchment modeling across metropolitan regions.

## Free Hosting & Deployment

The web client is self-contained with offline dataset fallbacks, allowing static hosting on Vercel, Netlify, or Docker.

### Vercel Deployment
1. Connect this repository to Vercel.
2. Build command: `npm --prefix frontend install && npm --prefix frontend run build`
3. Output directory: `frontend/dist`

### Netlify Deployment
1. Connect this repository to Netlify.
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`

### Docker Deployment
```bash
docker build -t commute-platform .
docker run -p 3000:80 commute-platform
```

## Features

- **Candidate Properties**: 5 Grade-A commercial tech parks per metropolitan region.
- **Transit Corridors**: 1,500 road and rail transit routes derived from open routing networks.
- **Commute Catchments**: Travel-time isochrones (15m, 30m, 45m, 60m).
- **Workforce Analytics**: Distribution maps, centroid calculations, and modal split metrics.
- **Enterprise UI**: Information-dense tables, sharp borders, and tabular figures.

## Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev

# Full stack (Frontend + Backend)
./start.sh
```

## License
MIT
