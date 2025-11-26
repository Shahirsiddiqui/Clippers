const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const youtubedl = require('youtube-dl-exec');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create downloads directory
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
fs.ensureDirSync(DOWNLOADS_DIR);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from downloads directory
app.use('/downloads', express.static(DOWNLOADS_DIR));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Video Downloader Backend Server is running!' });
});

// Get video info
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Get video info using youtube-dl-exec
    const info = await youtubedl(url, {
      dumpJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    });

    // Extract relevant information
    const videoInfo = {
      title: info.title,
      duration: info.duration,
      thumbnail: info.thumbnail,
      formats: info.formats
        .filter(format => format.vcodec !== 'none' && format.acodec !== 'none')
        .map(format => ({
          format_id: format.format_id,
          ext: format.ext,
          resolution: format.resolution,
          filesize: format.filesize,
          filesize_approx: format.filesize_approx,
          format_note: format.format_note,
          vcodec: format.vcodec,
          acodec: format.acodec
        }))
        .sort((a, b) => {
          // Sort by quality (highest first)
          const aQuality = parseInt(a.resolution) || 0;
          const bQuality = parseInt(b.resolution) || 0;
          return bQuality - aQuality;
        })
    };

    res.json(videoInfo);
  } catch (error) {
    console.error('Error getting video info:', error);
    res.status(500).json({ error: 'Failed to get video information' });
  }
});

// Download video
app.post('/api/download', async (req, res) => {
  try {
    const { url, format_id } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const downloadId = uuidv4();
    const outputPath = path.join(DOWNLOADS_DIR, `${downloadId}.%(ext)s`);

    // Download options
    const downloadOptions = {
      output: outputPath,
      format: format_id || 'best[vcodec!=none][acodec!=none][ext=mp4][filesize<1G]/best[ext=mp4]',
      noPlaylist: true,
      writeThumbnail: false,
      writeInfoJson: false,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: false,
    };

    // Start download
    const downloadProcess = youtubedl(url, downloadOptions);
    
    let downloadInfo = null;
    
    downloadProcess.then((info) => {
      downloadInfo = info;
      
      // Wait a bit for file to be completely written
      setTimeout(() => {
        try {
          // Find the downloaded file
          const files = fs.readdirSync(DOWNLOADS_DIR);
          const videoFile = files.find(file => file.startsWith(downloadId) && !file.endsWith('.jpg') && !file.endsWith('.json'));
          
          if (videoFile) {
            console.log(`Download successful: ${videoFile}`);
            res.json({
              downloadId,
              filename: videoFile,
              downloadUrl: `/downloads/${videoFile}`,
              info: {
                title: info.title,
                duration: info.duration,
                format: info.format
              }
            });
          } else {
            console.log(`File not found for downloadId: ${downloadId}`);
            res.status(500).json({ error: 'Download completed but file not found' });
          }
        } catch (err) {
          console.error('Error in response handler:', err);
          res.status(500).json({ error: 'Error processing download response' });
        }
      }, 1000);
    }).catch((error) => {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Download failed' });
    });

  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download video' });
  }
});

// Clean up old downloads
app.delete('/api/downloads/:downloadId', (req, res) => {
  try {
    const { downloadId } = req.params;
    const files = fs.readdirSync(DOWNLOADS_DIR);
    
    files.forEach(file => {
      if (file.startsWith(downloadId)) {
        fs.removeSync(path.join(DOWNLOADS_DIR, file));
      }
    });
    
    res.json({ message: 'Download files cleaned up' });
  } catch (error) {
    console.error('Error cleaning up downloads:', error);
    res.status(500).json({ error: 'Failed to clean up downloads' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Video Downloader Server is running on port ${PORT}`);
  console.log(`Downloads directory: ${DOWNLOADS_DIR}`);
});