# LLM-Integration – OpenRouter / OpenAI / Together.ai

Das Starter Kit enthält zwei KI-Features, die über einen gemeinsamen Service Layer (`src/lib/ai.ts`) einen von drei LLM-Providern nutzen – austauschbar via ENV-Variable.

---

## Features

| Use Case | Feature | Route / Ort im UI | Rolle |
|---|---|---|---|
| 1 | Antrag-Text verbessern | `/ai-demo` → «KI-Assistent» in der Navigation | alle Rollen |
| 2 | Antrag-Dokument analysieren (PDF) | Antrag-Detailseite → Karte «KI-Dokumentenanalyse» | Admin, Reviewer |

---

## Schnellstart

### 1. API-Key besorgen

**Option A – OpenRouter (empfohlen für Studierende):**
- Zugang über bestehende Kurs-Accounts
- API-Keys: https://openrouter.ai/keys
- Breite Modellauswahl (OpenAI, Anthropic, Llama, Gemini, …)
- Kein eigenes npm-Package nötig — nutzt das bereits installierte `openai`-Package

**Option B – Together.ai:**
- Kostenloser Free Tier ($5 Guthaben, kein Zahlungsmittel nötig)
- Registrierung: https://api.together.ai → API Keys

**Option C – OpenAI:**
- Pay-per-use, Zahlungsdaten erforderlich
- Registrierung: https://platform.openai.com → API Keys

### 2. `.env` konfigurieren

```env
# Provider auswählen: 'openrouter', 'together' oder 'openai'
LLM_PROVIDER=openrouter

# OpenRouter (empfohlen)
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_CHAT_MODEL=openai/gpt-4o-mini

# Together.ai (Free Tier)
TOGETHERAI_API_KEY=...
TOGETHERAI_CHAT_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo

# OpenAI (kostenpflichtig)
OPENAI_API_KEY=sk-proj-...
OPENAI_CHAT_MODEL=gpt-4o-mini
```

> Nur der jeweils gewählte Provider (`LLM_PROVIDER`) wird initialisiert – die Keys der anderen Provider können leer bleiben.

### 3. App neu starten

```bash
npm run dev
```

---

## Use Case 1 – Antrag-Text verbessern

**Seite:** `/ai-demo` («KI-Assistent» in der Navigation, für alle Rollen sichtbar)

1. Text in das Eingabefeld eingeben (z. B. einen Urlaubsantrag-Entwurf)
2. «Text verbessern» klicken
3. Die KI gibt eine sprachlich und inhaltlich verbesserte Version zurück
4. Optional: «Übernehmen» kopiert den verbesserten Text zurück ins Eingabefeld

**API-Route:** `POST /api/ai/chat` – erwartet `{ prompt: string }`, gibt `{ antwort: string }` zurück.

---

## Use Case 2 – Antrag-Dokument analysieren

**Voraussetzung:** Ein PDF-Dokument muss zum Antrag hochgeladen sein (Teil 5: Dateiupload).

**Ort im UI:** Antrag-Detailseite → Karte «KI-Dokumentenanalyse» (nur sichtbar für Admin und Reviewer, wenn ein Dokument vorhanden ist)

1. Als `admin@example.com` oder `reviewer@example.com` einloggen
2. Einen Antrag öffnen, der ein hochgeladenes PDF enthält
3. «Dokument analysieren» klicken
4. Die KI-Analyse erscheint mit:
   - **Zusammenfassung** des Dokumentinhalts
   - **Kernpunkte** als Liste
   - **Empfehlung** (Genehmigen / Ablehnen / Nachfordern)
5. Das Ergebnis wird in `Antrag.kiAnalyse` (JSON) gespeichert und bleibt beim nächsten Öffnen sichtbar

**API-Route:** `POST /api/ai/analyze-document` – erwartet `{ antragId: string }`, gibt `{ analyse: {...} }` zurück.

---

## Anbieter im Vergleich

| | OpenRouter | Together.ai | OpenAI |
|---|---|---|---|
| `LLM_PROVIDER`-Wert | `openrouter` | `together` | `openai` |
| Kosten | Kurs-Account | Free Tier ($5) | Pay-per-use |
| Registrierung | https://openrouter.ai | https://api.together.ai | https://platform.openai.com |
| Standardmodell | `openai/gpt-4o-mini` | Llama 3.3 70B | GPT-4o-mini |
| Modellauswahl | Sehr gross (OpenAI, Anthropic, Llama, …) | Mittel (Open-Source) | OpenAI-Modelle |
| Empfehlung | Für Kurs | Fallback | Für Produktion |
| npm-Package | `openai` (bereits vorhanden) | `together-ai` | `openai` |

---

## Architektur

```
src/lib/ai.ts          # Service Layer: Provider-Auswahl via LLM_PROVIDER
src/app/api/ai/
  chat/route.ts              # Use Case 1: Text verbessern
  analyze-document/route.ts  # Use Case 2: PDF analysieren
src/app/(app)/ai-demo/page.tsx                     # UI Use Case 1
src/components/antraege/antrag-analyse-button.tsx  # UI Use Case 2
```

`src/lib/ai.ts` exportiert `askLLM(options)` und `readPdfAsBase64(dateiPfad)`. Der Provider wird zur Laufzeit via `LLM_PROVIDER` ausgewählt – kein Code-Wechsel nötig beim Wechsel zwischen den Providern.

OpenRouter nutzt das bereits installierte `openai`-Package mit der `baseURL: 'https://openrouter.ai/api/v1'` — es ist kein zusätzliches npm-Package erforderlich.
