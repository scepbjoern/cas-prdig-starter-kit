# VS Code Port Forwarding – App für Demos teilen

Ermöglicht, die lokal laufende App für andere Laptops und das Publikum zugänglich zu machen.

> **Voraussetzung:** VS Code mit GitHub-Account (für Dev Tunnels)
> Referenz: `impl-00-tech-stack-decisions.md` → Abschnitt 3

## Schritte

1. **App starten:**
   ```bash
   npm run dev
   ```

2. **Port Forwarding öffnen:**
   - VS Code → Terminal-Panel → Tab **«Ports»** öffnen
   - Oder: `Ctrl+Shift+P` → «Forward a Port»

3. **Port weiterleiten:**
   - «Forward Port» klicken → Port `3000` eingeben → Enter

4. **Öffentlich machen:**
   - In der Ports-Liste: Rechtsklick auf Port 3000 → **«Port Visibility» → «Public»**

5. **URL teilen:**
   - Generierte URL (z.B. `https://abc123-3000.devtunnels.ms`) kopieren und teilen
   - Diese URL ist so lange aktiv, wie VS Code offen und der Dev-Server läuft

## Mehrere Dienste

Für mehrere Ports (z.B. Frontend 3000 + Webhook-Endpoint für Resend):
- Beide Ports können gleichzeitig im Ports-Tab weitergeleitet werden
- Jeder Port erhält eine eigene URL

## Gültigkeitsdauer

Die URL ist **session-gebunden**: Aktiv solange VS Code offen und App läuft.
Beim nächsten Start entsteht eine neue URL. Für Demo-Sessions von 30–60 Minuten ist die Stabilität gut (Laptop nicht in Ruhezustand versetzen).

## Fallback: Localtunnel

Falls VS Code Port Forwarding nicht funktioniert:
```bash
npx localtunnel --port 3000
```
Kein Download, kein Account nötig. Weniger stabil, aber ausreichend für kurze Demos.
