#!/usr/bin/env bash

# Colliers Commute: Single Command Launcher
# Starts Spring Boot Backend + React WebGL Map Frontend & opens the browser

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$DIR/backend"
FRONTEND_DIR="$DIR/frontend"
JAR_FILE="$BACKEND_DIR/target/colliers-commute-1.0.0.jar"
BACKEND_PORT=8080
FRONTEND_PORT=5173

echo "=========================================================="
echo "      COLLIERS COMMUTE - LOCATION INTELLIGENCE PLATFORM   "
echo "=========================================================="

cleanup() {
    echo ""
    echo "Stopping Colliers Commute services..."
    if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    # Cleanup any hanging ports
    fuser -k $BACKEND_PORT/tcp 2>/dev/null || true
    fuser -k $FRONTEND_PORT/tcp 2>/dev/null || true
    echo "All services stopped."
    exit 0
}

trap cleanup INT TERM EXIT

# Free ports if previously running
fuser -k $BACKEND_PORT/tcp 2>/dev/null || true
fuser -k $FRONTEND_PORT/tcp 2>/dev/null || true

# 1. Start Backend
echo "-> Starting Java Spring Boot Backend (Port $BACKEND_PORT)..."
if [ ! -f "$JAR_FILE" ]; then
    echo "   Building backend JAR with Maven..."
    (cd "$BACKEND_DIR" && mvn package -DskipTests -q)
fi

java -jar "$JAR_FILE" > "$BACKEND_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

# Wait for backend health check
echo "   Waiting for backend API..."
MAX_TRIES=30
COUNT=0
until curl -s "http://localhost:$BACKEND_PORT/api/v1/commute/health" > /dev/null; do
    sleep 0.5
    COUNT=$((COUNT+1))
    if [ $COUNT -ge $MAX_TRIES ]; then
        echo "   [WARNING] Backend took longer than expected to start. Check $BACKEND_DIR/backend.log"
        break
    fi
done
echo "   [OK] Spring Boot Backend running on http://localhost:$BACKEND_PORT"

# 2. Start Frontend
echo "-> Starting React MapLibre Frontend (Port $FRONTEND_PORT)..."
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "   Installing frontend dependencies..."
    (cd "$FRONTEND_DIR" && npm install --silent)
fi

(cd "$FRONTEND_DIR" && npx vite --port $FRONTEND_PORT --host) > "$FRONTEND_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

# Wait for frontend port
COUNT=0
until curl -s "http://localhost:$FRONTEND_PORT" > /dev/null; do
    sleep 0.5
    COUNT=$((COUNT+1))
    if [ $COUNT -ge $MAX_TRIES ]; then
        break
    fi
done
echo "   [OK] Frontend UI ready on http://localhost:$FRONTEND_PORT"

# 3. Open Browser
URL="http://localhost:$FRONTEND_PORT"
echo "-> Opening Colliers Commute in your default browser: $URL"

if command -v xdg-open > /dev/null; then
    xdg-open "$URL" > /dev/null 2>&1 &
elif command -v sensible-browser > /dev/null; then
    sensible-browser "$URL" > /dev/null 2>&1 &
elif command -v google-chrome > /dev/null; then
    google-chrome "$URL" > /dev/null 2>&1 &
elif command -v firefox > /dev/null; then
    firefox "$URL" > /dev/null 2>&1 &
else
    echo "   Please navigate to $URL in your browser."
fi

echo ""
echo "=========================================================="
echo " Colliers Commute is now running at: http://localhost:5173"
echo " Press Ctrl+C in this terminal to shut down all services. "
echo "=========================================================="
echo ""

# Keep running until Ctrl+C
wait $BACKEND_PID $FRONTEND_PID
