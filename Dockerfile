FROM node:18

WORKDIR /app

# Install ffmpeg and other dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend files
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

EXPOSE 5000

CMD ["npm", "start"]
