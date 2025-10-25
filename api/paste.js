// api/paste.js
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "pastes.json");

function readData() {
  if (!fs.existsSync(FILE)) return {};
  try { return JSON.parse(fs.readFileSync(FILE, "utf8") || "{}"); }
  catch { return {}; }
}

function writeData(d) {
  fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
}

export default function handler(req, res) {
  if (req.method === "POST") {
    const { content } = req.body || {};
    if (!content) return res.status(400).json({ error: "empty" });
    const id = Math.random().toString(36).slice(2, 8);
    const data = readData();
    data[id] = { content, createdAt: Date.now() };
    writeData(data);
    return res.status(200).json({ id });
  }

  if (req.method === "GET") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "missing_id" });
    const data = readData();
    if (!data[id]) return res.status(404).json({ error: "not_found" });
    return res.status(200).json(data[id]);
  }

  res.status(405).json({ error: "method_not_allowed" });
}
