// api/raw.js
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "pastes.json");

function readData() {
  if (!fs.existsSync(FILE)) return {};
  try { return JSON.parse(fs.readFileSync(FILE, "utf8") || "{}"); }
  catch { return {}; }
}

export default function handler(req, res) {
  const id = req.query.id || (req.url && new URL(req.url, "http://a").searchParams.get("id"));
  if (!id) return res.status(400).send("missing id");

  const data = readData();
  if (!data[id]) return res.status(404).send("not found");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(data[id].content);
}
