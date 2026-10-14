import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization with aistudio-build User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Multi-turn Chat API with Google Search Grounding using gemini-3.8-flash
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, searchEnabled = true } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Format contents array for Gemini multi-turn conversation
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const config: any = {
      systemInstruction:
        "You are '5tar Card AI Assistant' (5tar कार्ड एआई सहायक), an expert digital consultant for 5tar Employee Card Maker created by 5tar Suraj (Supriya Digital Research, Rudhauli, Basti, Uttar Pradesh, India). You assist users in creating perfect employee ID cards: crafting professional designations, department names, organization addresses, picking suitable card color palettes for different industries (hospitals, schools, tech companies, security, factories), explaining ISO CR80 print standards, and drafting card return terms. You can answer fluently in Hindi (हिंदी), English, or Hinglish based on the user's preference. Use Google Search to look up current organizational information, addresses, colleges, hospitals, and facts whenever helpful.",
    };

    let response: any;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config,
      });
    } catch (primaryErr: any) {
      console.warn('Primary model error, attempting fallback to gemini-3.1-flash-lite:', primaryErr?.message);
      // Fallback model without search tool if quota issue
      const fallbackConfig = { ...config };
      if (primaryErr?.message?.includes('429') || primaryErr?.message?.includes('quota')) {
        delete fallbackConfig.tools;
      }
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: fallbackConfig,
      });
    }

    const text = response.text || '';
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries =
      response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    return res.json({
      text,
      sources: groundingChunks,
      webSearchQueries,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response from Gemini AI.',
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
