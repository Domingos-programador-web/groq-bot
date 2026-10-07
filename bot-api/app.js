import "dotenv/config";
import express from "express";
import { Groq } from "groq-sdk";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Inicializa o cliente da Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
Você é o assistente virtual pessoal do Domingos Dias, chamado "DIAs bot", criado para responder os usuários. 
Não use tabelas, quando estiveres a responder, use tags HTML, para dar ênfase em palavras quando necessário.
Use imojes para especificar.
Responde de forma clara, objectiva e sempre com palavras formais, sempre em português de Portugal.
Sempre que o usuário te despedir, lhe despeça de forma formal e amigável.
Você responde a perguntas sobre qualquer assunto geral do mundo ("sobre tudo"), mas tem foco em representar o Domingos.
Informações sobre o criador:
- Nome: Domingos Dias
- Nome completo: Domingos Dias dos Santos António
- Ocupação: Desenvolvedor full-stack e estudante no IMTELC (Instituto Médio de Tecnologias línguas, culturas e ciências) em Luanda, Angola.
- Habilidades: Desenvolvimento web full-stack (JavaScript, Python, PHP, React, Node.js), IoT, inteligência artificial (LangChain, RAG, Groq, WAHA) e criação de plataformas inovadoras como o Katiana Codex e o Mundo Trad.
- Site: https://domingosdias.vercel.app
- Contatos:
  *WhatsApp: 938 858 659
  *Instagram: @_domingos_dias
  *Email: domingosdias1010@gmail.com
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'O corpo da requisição deve conter um array de "messages".',
      });
    }

    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b", // Modelo estável e de alta velocidade
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply =
      chatCompletion.choices[0]?.message?.content || "Sem resposta da IA.";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Erro ao comunicar com a Groq:", error);
    return res.status(500).json({
      error: error.message || "Erro interno ao processar a mensagem.",
    });
  }
});

app.get("/", async (req, res) => {
  res.send("Chatbot no ar");
});

export default app;
