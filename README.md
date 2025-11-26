# Video Downloader

A sleek and modern video downloading web application built with React frontend and Express backend, powered by yt-dlp.

## Features

- 🎥 Download videos from YouTube and other supported platforms
- 🎨 Clean, modern, and responsive UI design
- ⚡ Fast video analysis and processing
- 📊 Multiple quality/format selection
- 📱 Mobile-friendly responsive design
- 🔒 Secure file handling with unique IDs
- 📁 Automatic file organization

## Demo

![Video Downloader Interface](https://via.placeholder.com/800x400/667eea/ffffff?text=Video+Downloader+Interface)

## Tech Stack

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express.js
- **Video Processing**: yt-dlp
- **Styling**: Modern CSS with gradients and animations
- **File Management**: UUID, fs-extra

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

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd video-mvp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on http://localhost:5000

### 3. Start the Frontend Development Server

In a new terminal:
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173

## Usage

1. **Paste Video URL**: Copy and paste any video URL from YouTube or other supported platforms
2. **Analyze Video**: Click "Analyze" to fetch video information and available formats
3. **Select Quality**: Choose your preferred video quality from the available options
4. **Download**: Click "Download Video" to start the download process
5. **Save File**: Once complete, click "Download File" to save the video to your device

## Project Structure

```
video-mvp/
├── backend/          # Express.js backend server
│   ├── package.json
│   ├── server.js     # Main server file with yt-dlp integration
│   ├── .env          # Environment variables
│   ├── downloads/    # Downloaded videos storage
│   └── README.md
└── frontend/         # React frontend application
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   └── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx   # Main application component
        └── App.css   # Styling
```

## API Endpoints

### Backend API

- `POST /api/video-info` - Get video information and available formats
- `POST /api/download` - Download video with selected format
- `DELETE /api/downloads/:downloadId` - Clean up downloaded files
- `GET /downloads/:filename` - Serve downloaded video files

## Configuration

### Environment Variables (Backend)

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `DOWNLOADS_DIR` - Directory for storing downloads
- `MAX_DOWNLOAD_SIZE` - Maximum file size limit in bytes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Disclaimer

This tool is for educational purposes only. Please respect copyright laws and terms of service of video platforms. Only download videos that you have permission to download.

## Support

If you encounter any issues or have questions, please open an issue in the repository.