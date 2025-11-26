# Video Downloader Backend

This is the backend server for the Video Downloader application, built with Express.js and yt-dlp.

## Features

- Video URL analysis and information extraction
- Support for multiple video platforms (YouTube, etc.)
- Multiple quality/format selection
- Video download with progress tracking
- Automatic file cleanup
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- yt-dlp binary installed on your system

### Installing yt-dlp

**Windows:**
```powershell
# Using pip
pip install yt-dlp

# Or download the executable
# Visit: https://github.com/yt-dlp/yt-dlp/releases/latest
# Download yt-dlp.exe and place it in your PATH
```

**macOS/Linux:**
```bash
# Using pip
pip install yt-dlp

# Or using brew (macOS)
brew install yt-dlp

# Or download the binary
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

## Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Get Video Information
- **POST** `/api/video-info`
- **Body:** `{ "url": "video_url_here" }`
- **Response:** Video metadata including title, duration, thumbnail, and available formats

### Download Video
- **POST** `/api/download`
- **Body:** `{ "url": "video_url_here", "format_id": "format_id_here" }`
- **Response:** Download details including file URL and metadata

### Clean Up Download
- **DELETE** `/api/downloads/:downloadId`
- **Response:** Success message

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `DOWNLOADS_DIR` - Directory for storing downloaded files (default: downloads)
- `MAX_DOWNLOAD_SIZE` - Maximum file size in bytes (default: 1GB)

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **yt-dlp-wrap** - yt-dlp Node.js wrapper
- **fs-extra** - Enhanced file system operations
- **uuid** - Unique ID generation
- **archiver** - File archiving utilities

## Development

The server runs on port 5000 by default and serves downloaded files from the `/downloads` endpoint. Downloaded videos are stored in the `downloads/` directory with unique IDs to prevent conflicts.

## Security Notes

- Downloads are automatically assigned unique IDs
- Files should be cleaned up periodically to prevent disk space issues
- Consider implementing rate limiting for production use
- Validate and sanitize all user inputs