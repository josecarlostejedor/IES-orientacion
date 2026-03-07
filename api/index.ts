import express from "express";
import path from "path";

// In-memory store for results (stateless on Vercel, but avoids build errors)
const resultsStore: any[] = [];

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes
app.post("/api/results", (req, res) => {
  const result = {
    ...req.body,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  resultsStore.push(result);
  res.json({ success: true, id: result.id });
});

app.get("/api/results", (req, res) => {
  res.json(resultsStore.sort((a, b) => b.id - a.id));
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
