import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState(null)
  const [selectedFormat, setSelectedFormat] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const getVideoInfo = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a video URL')
      return
    }

    if (!isValidUrl(videoUrl)) {
      setError('Please enter a valid URL')
      return
    }

    setError('')
    setLoading(true)
    setVideoInfo(null)
    setDownloadUrl('')

    try {
      const response = await fetch(`${API_URL}/api/video-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to get video information')
      }

      const data = await response.json()
      setVideoInfo(data)
      setSelectedFormat(data.formats[0]?.format_id || '')
    } catch (err) {
      setError('Failed to get video information. Please check the URL and try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadVideo = async () => {
    if (!selectedFormat) {
      setError('Please select a video quality')
      return
    }

    setError('')
    setDownloading(true)

    try {
      const response = await fetch(`${API_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoUrl,
          format_id: selectedFormat,
        }),
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const data = await response.json()
      setDownloadUrl(`${API_URL}${data.downloadUrl}`)
    } catch (err) {
      setError('Failed to download video. Please try again.')
      console.error('Error:', err)
    } finally {
      setDownloading(false)
    }
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown size'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFilteredFormats = (formats) => {
    const targetResolutions = ['1080', '720', '480']
    const filtered = []
    
    for (const res of targetResolutions) {
      const format = formats.find(f => {
        const resolution = f.resolution || ''
        return resolution.includes(res)
      })
      if (format && !filtered.find(f => f.format_id === format.format_id)) {
        filtered.push(format)
      }
    }
    
    return filtered.length >= 3 ? filtered.slice(0, 3) : filtered.length > 0 ? filtered : formats.slice(0, 3)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">Clippers</h1>
          <p className="subtitle">Download videos from YouTube and other platforms</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="download-section">
            <div className="url-input-group">
              <input
                type="url"
                placeholder="Paste video URL here... (YouTube,Facebook,Instagram etc.)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="url-input"
                onKeyPress={(e) => e.key === 'Enter' && getVideoInfo()}
              />
              {loading ? (
                <div className="btn btn-primary loader-btn">
                  <span className="spinner"></span>
                  Analyzing...
                </div>
              ) : (
                <button
                  onClick={getVideoInfo}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  Analyze
                </button>
              )}
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {videoInfo && (
              <div className="video-info">
                <div className="video-preview">
                  {videoInfo.thumbnail && (
                    <img 
                      src={videoInfo.thumbnail} 
                      alt={videoInfo.title}
                      className="thumbnail"
                    />
                  )}
                  <div className="video-details">
                    <h3 className="video-title">{videoInfo.title}</h3>
                    <p className="video-duration">Duration: {formatDuration(videoInfo.duration)}</p>
                  </div>
                </div>

                <div className="format-selection">
                  <h4>Select Quality:</h4>
                  <div className="format-list">
                    {getFilteredFormats(videoInfo.formats).map((format) => (
                      <label key={format.format_id} className="format-option">
                        <input
                          type="radio"
                          name="format"
                          value={format.format_id}
                          checked={selectedFormat === format.format_id}
                          onChange={(e) => setSelectedFormat(e.target.value)}
                        />
                        <span className="format-info">
                          {format.resolution || 'Audio'} - {format.ext.toUpperCase()}
                          {format.filesize ? ` - ${formatFileSize(format.filesize)}` : ''}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="download-actions">
                  {downloading ? (
                    <div className="btn btn-download loader-btn">
                      <span className="spinner"></span>
                      Downloading...
                    </div>
                  ) : (
                    <button
                      onClick={downloadVideo}
                      disabled={downloading || !selectedFormat}
                      className="btn btn-download"
                    >
                      Download Video
                    </button>
                  )}
                </div>
              </div>
            )}

            {downloadUrl && (
              <div className="download-complete">
                <h4>Download Complete!</h4>
                <a
                  href={downloadUrl}
                  download
                  className="btn btn-success"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>clippers video downloader</p>
        </div>
      </footer>
    </div>
  )
}

export default App