// file: api/download.ts

import type { VercelRequest, VercelResponse } from "@vercel/node";
import "dotenv/config";

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const GA_API_SECRET = process.env.GA_API_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // e.g. /api/download?file=ez%20mq%201.0.zip
  const { file } = req.query;

  if (!file || typeof file !== "string") {
    return res.status(400).send('Missing or invalid "file" param');
  }

  // Log the GA "file_download" event
  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "download-logger",
          events: [
            {
              name: "file_download",
              params: {
                file_name: file,
                debug_mode: true,
              },
            },
          ],
        }),
      }
    );
    console.log(GA_MEASUREMENT_ID);
    console.log(GA_API_SECRET);
    console.log("GA response status:", response.status);
    console.log("GA response text:", await response.text());
  } catch (err) {
    console.error("GA logging failed:", err);
    // We'll still proceed with redirect
  }

  // Redirect to the actual file in public/files
  // If file name has spaces, encode it so the URL is valid.
  const encoded = encodeURI(file);

  // Example: /files/ez%20mq%201.0.zip
  res.redirect(`/files/${encoded}`);
}
