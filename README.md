# SEKHMET Frontend

SEKHMET is the defense coordination frontend for the Sans Mercantile Constellation.

## Purpose
- Display threat streams, defense posture, incident response workflows, and risk analytics.
- Built for API-first integration and container deployment.

## Local Run
```bash
npm install
npm start
```

## API Integration
- Set the backend base URL with: `REACT_APP_API_BASE_URL=http://localhost:<backend-port>`
- Health endpoint: `${API_BASE_URL}/api/health`
- Threat endpoint: `${API_BASE_URL}/api/threats`

## Containerization
```bash
docker build -t sekhmet-frontend .
docker run -p 3003:3000 -e REACT_APP_API_BASE_URL=http://localhost:8000 sekhmet-frontend
```

## Notes
- The frontend is ready for containerized deployment and API integration.
- Use environment variables to point to local or deployed backend services.
