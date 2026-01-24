"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FFmpeg MCP Server
 * Developed by FlashID
 */
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const child_process_1 = require("child_process");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const server = new mcp_js_1.McpServer({
    name: "ffmpeg-mcp-server",
    version: "1.0.0",
});
server.tool("convert_video_to_images", "Convert an MP4 video file to a sequence of images (PNG or JPG) using FFmpeg.", {
    input_path: zod_1.z.string().describe("Absolute path to the input .mp4 file."),
    output_dir: zod_1.z.string().describe("Directory to save the output images."),
    format: zod_1.z.enum(["png", "jpg"]).default("png").describe("Output format (png or jpg). Default is png."),
    frame_rate: zod_1.z.number().optional().describe("Frames per second to extract. If omitted, extracts all frames."),
}, async ({ input_path, output_dir, format, frame_rate }) => {
    // Validate input file exists
    try {
        await promises_1.default.access(input_path);
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: Input file does not exist at path: ${input_path}`,
                },
            ],
            isError: true,
        };
    }
    // Ensure output directory exists
    try {
        await promises_1.default.mkdir(output_dir, { recursive: true });
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error creating output directory: ${error.message}`
                }
            ],
            isError: true
        };
    }
    // Construct FFmpeg arguments
    const args = ["-i", input_path];
    if (frame_rate) {
        args.push("-vf", `fps=${frame_rate}`);
    }
    if (format === "png") {
        // High quality with transparency if applicable
        // Note: The user mentioned -pix_fmt rgba for PNG
        args.push("-pix_fmt", "rgba");
        args.push(path_1.default.join(output_dir, "output_%04d.png"));
    }
    else {
        // JPG, smaller size, no transparency
        args.push(path_1.default.join(output_dir, "output_%04d.jpg"));
    }
    // Determine FFmpeg executable path
    let ffmpegCmd = "ffmpeg";
    const customPath = "C:\\ffmpeg\\bin\\ffmpeg.exe";
    try {
        await promises_1.default.access(customPath);
        ffmpegCmd = customPath;
    }
    catch (e) {
        // Custom path not found, rely on PATH
    }
    return new Promise((resolve) => {
        const ffmpeg = (0, child_process_1.spawn)(ffmpegCmd, args);
        let stderr = "";
        ffmpeg.stderr.on("data", (data) => {
            stderr += data.toString();
        });
        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve({
                    content: [
                        {
                            type: "text",
                            text: `Successfully converted video to images in ${output_dir}`,
                        },
                    ],
                });
            }
            else {
                resolve({
                    content: [
                        {
                            type: "text",
                            text: `FFmpeg process failed with code ${code}.\nStderr: ${stderr}`,
                        },
                    ],
                    isError: true,
                });
            }
        });
        ffmpeg.on("error", (err) => {
            resolve({
                content: [
                    {
                        type: "text",
                        text: `Failed to spawn FFmpeg process: ${err.message}. Is FFmpeg installed and in your PATH?`,
                    }
                ],
                isError: true
            });
        });
    });
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("FFmpeg MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
