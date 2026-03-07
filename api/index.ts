import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

let db: any;
try {
  const Database = (await import("better-sqlite3")).default;
  const dbPath = process.env.VERCEL ? "/tmp/orientation.db" : "orientation.db";
  db = new Database(dbPath);
} catch (e) {
  console.error("Database not available:", e);
  // Mock db for environments where better-sqlite3 fails to load
  db = {
    exec: () => {},
    prepare: () => ({
      run: () => ({ lastInsertRowid: 0 }),
      all: () => []
    })
  };
}

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS race_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    age INTEGER,
    course TEXT,
    group_num TEXT,
    selectedRoute TEXT,
    startTime TEXT,
    endTime TEXT,
    duration INTEGER,
    controls TEXT,
    borgScale INTEGER,
    score INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Ensure all columns exist
const columns = [
  { name: "group_num", type: "TEXT" },
  { name: "selectedRoute", type: "TEXT" },
  { name: "borgScale", type: "INTEGER" },
  { name: "score", type: "INTEGER" }
];

for (const col of columns) {
  try {
    db.exec(`ALTER TABLE race_results ADD COLUMN ${col.name} ${col.type}`);
  } catch (e) {
    // Column likely already exists
  }
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes
app.post("/api/results", (req, res) => {
  const { firstName, lastName, age, course, group_num, selectedRoute, startTime, endTime, duration, controls, borgScale, score } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO race_results (firstName, lastName, age, course, group_num, selectedRoute, startTime, endTime, duration, controls, borgScale, score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      firstName, 
      lastName, 
      age, 
      course, 
      group_num, 
      selectedRoute, 
      startTime, 
      endTime, 
      duration, 
      JSON.stringify(controls),
      borgScale,
      score
    );
    
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save results" });
  }
});

app.get("/api/results", (req, res) => {
  try {
    const results = db.prepare("SELECT * FROM race_results ORDER BY createdAt DESC").all();
    res.json(results.map(r => ({
      ...r,
      controls: JSON.parse(r.controls as string)
    })));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer().catch(console.error);

export default app;
