import express from "express";
import path from "path";

// In-memory store for results (stateless on Vercel, but avoids build errors)
const resultsStore: any[] = [];

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes
app.post("/api/results", async (req, res) => {
  const result = {
    ...req.body,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  resultsStore.push(result);

  // Also send to Google Sheets from the server (more reliable)
  const googleSheetsUrl = (process.env.GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbyUv7-v574stJg366eH31ukQfUvQIT57Bn50LYziITiHSnUZQLNliMtE33JXUxzp_dT7A/exec').trim();
  
  try {
    // Prepare a super-robust payload
    const payload = {
      nombre: req.body.firstName || req.body.nombre || "",
      apellidos: req.body.lastName || req.body.apellidos || "",
      curso: req.body.course || req.body.curso || "",
      grupo: req.body.group_num || req.body.group || req.body.grupo || "",
      recorrido: req.body.selectedRoute || req.body.recorrido || req.body.courseName || "No especificado",
      puntuacion: req.body.score || req.body.puntuacion || 0,
      tiempo: req.body.duration || req.body.tiempo || "",
      fecha: new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" }),
      borg: req.body.borgScale || req.body.borg || 0,
      aciertos: req.body.controls ? req.body.controls.filter((c: any) => c.isCorrect).length : 0
    };

    console.log('--- GOOGLE SHEETS SYNC START ---');
    console.log('Target URL:', googleSheetsUrl);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // Server-side fetch with application/json
    const response = await fetch(googleSheetsUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });
    
    const responseText = await response.text();
    if (response.ok) {
      console.log('Data sent to Google Sheets successfully. Response:', responseText);
    } else {
      console.error('Google Sheets returned error status:', response.status);
      console.error('Response body:', responseText);
    }
    console.log('--- GOOGLE SHEETS SYNC END ---');
  } catch (error) {
    console.error('Error sending to Google Sheets from server:', error);
  }

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
