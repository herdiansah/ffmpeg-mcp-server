# FFmpeg MCP Server

A local MCP server that provides tools to convert video files to image sequences using FFmpeg.

## Features

-   **convert_video_to_images**: Convert `.mp4` video files to a sequence of images (PNG or JPG).
    -   Supports extracting all frames or at a specific frame rate.
    -   Preserves transparency for PNGs using `rgba`.

## Installation

1.  **Prerequisites**:
    -   Node.js installed.
    -   **FFmpeg** installed (download from [ffmpeg.org/download.html](https://ffmpeg.org/download.html)) and added to your system's PATH. You can verify this by running `ffmpeg -version` in your terminal.
2.  **Setup**:
    ```bash
    npm install
    npm run build
    ```

## Usage

To use this server with an MCP client (like Claude Desktop or the MCP Inspector):

### Configuration

Add the server to your MCP client configuration (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ffmpeg": {
      "command": "node",
      "args": ["/path/to/ffmpeg-mcp-server/build/index.js"]
    }
  }
}
```

Replace `/path/to/ffmpeg-mcp-server` with the actual absolute path to this directory.

### Tools

#### `convert_video_to_images`

Arguments:
- `input_path` (required): Absolute path to the input video file (e.g., `C:/Videos/mypath/video.mp4`).
- `output_dir` (required): Directory where images will be saved (e.g., `C:/Videos/mypath/frames`).
- `format` (optional): "png" or "jpg". Default is "png".
- `frame_rate` (optional): Number of frames per second to extract. e.g., `1` for 1 fps. If omitted, extracts all frames.

## Developer Profile

This tool was developed by **Herdiansah - FlashID**.
**https://herdiansah.com/**
**https://flashidinteractive.com/**

-   **Project**: MCP FFmpeg Server
-   **Purpose**: Enable local LLM agents to interact with video content via FFmpeg.

