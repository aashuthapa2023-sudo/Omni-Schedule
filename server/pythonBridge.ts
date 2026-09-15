import { spawn } from "child_process";
import path from "path";

export interface PythonQuoteRequest {
  niche: string;
  author: string;
  quote: string;
  handle?: string;
  pageId?: string;
  postIndex?: number;
  template?: string;
  sourcePreference?: string;
  usedImageUrls?: string[];
}

export interface PythonQuoteResponse {
  success: boolean;
  pythonEngine?: string;
  imageSource?: string;
  imageTitle?: string;
  rawSourceImageUrl?: string;
  renderedImageUrl?: string;
  staticPath?: string;
  quote?: string;
  author?: string;
  nicheCategory?: string;
  readyForFacebook?: boolean;
  error?: string;
  timestamp?: number;
}

/**
 * Executes the Python Quote Factory script with input data passed via stdin.
 */
export async function executePythonQuoteFactory(
  input: PythonQuoteRequest | PythonQuoteRequest[]
): Promise<PythonQuoteResponse | { success: boolean; batch: PythonQuoteResponse[] }> {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), "python_quote_factory.py");
    const pythonProcess = spawn("python3", [scriptPath]);

    let outputData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0 && outputData.trim()) {
        try {
          const parsed = JSON.parse(outputData.trim());
          resolve(parsed);
          return;
        } catch (e: any) {
          // Fallback if json parsing fails
          console.warn("Failed to parse python output:", e);
        }
      }

      console.warn(`Python process exited with code ${code}. Stderr: ${errorData}`);
      resolve({
        success: false,
        error: errorData || `Python script returned empty or invalid output (code ${code})`,
      });
    });

    // Write input to stdin and close stdin
    pythonProcess.stdin.write(JSON.stringify(input));
    pythonProcess.stdin.end();
  });
}
