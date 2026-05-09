# LLM-Integration – OpenAI / Together.ai

KI-Features im Starter Kit nutzen Large Language Models über die OpenAI-kompatible API.

> **Ausführliche Implementierungsanleitung:** [`../starter-kit-erstellung/impl-07-ai.md`](../starter-kit-erstellung/impl-07-ai.md)

---

## Features

| Use Case | Feature | API-Route |
|---|---|---|
| 1 | LLM-Demo: Antrag-Text verbessern | `POST /api/ai/chat` |
| 2 | Antrag-Dokument analysieren (PDF) | `POST /api/ai/analyze-document` |

---

## Setup-Checkliste

1. `.env.local` öffnen
2. `LLM_PROVIDER` setzen: `"openai"` oder `"together"`
3. Entsprechenden API-Key eintragen (siehe unten)
4. App neu starten: `npm run dev`
5. Als `applicant@example.com` einloggen
6. Antrag erstellen → «KI-Unterstützung» Button testen
7. PDF hochladen → «Dokument analysieren» testen

---

## ENV-Variablen

```env
# LLM-Provider: 'openai' oder 'together'
LLM_PROVIDER=together

# OpenAI (kostenpflichtig, sofort; https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...

# Together AI (kostenloser Free Tier; https://api.together.ai)
TOGETHERAI_API_KEY=...
```

---

## Anbieter vergleichen

| | OpenAI | Together AI |
|---|---|---|
| Kosten | Kostenpflichtig (Pay-per-use) | Free Tier verfügbar |
| Modelle | GPT-4o, GPT-4o-mini | Llama 3, Mistral, Qwen u.a. |
| Qualität | Höchste | Gut für Prototypen |
| Registrierung | https://platform.openai.com | https://api.together.ai |

> **Tipp:** Für den Kurs reicht Together AI (kostenlos). Für bessere Qualität auf OpenAI wechseln.
