import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const response = await fetch(
      "https://fitzxel-cl-api.vercel.app/v2/modstack/news"
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch news from API: ${response.statusText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
