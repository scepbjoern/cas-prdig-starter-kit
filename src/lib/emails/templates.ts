export function antragEingereichtHtml(params: {
  antragTitel: string
  antragstellerName: string
  antragId: string
}): string {
  const { antragTitel, antragstellerName, antragId } = params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Antrag eingereicht</title>
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #f8f9fa; border-radius: 8px; padding: 24px;">
    <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">Antrag eingereicht</h1>
    <p style="color: #666; margin-bottom: 24px;">Ihr Antrag wurde erfolgreich eingereicht.</p>
    
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px;"><strong>Antrag:</strong> ${antragTitel}</p>
      <p style="margin: 0 0 8px;"><strong>Eingereicht von:</strong> ${antragstellerName}</p>
      <p style="margin: 0;"><strong>Status:</strong> EINGEREICHT – wartet auf Prüfung</p>
    </div>
    
    <a href="${appUrl}/antraege/${antragId}" 
       style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Antrag ansehen
    </a>
    
    <p style="color: #999; font-size: 12px; margin-top: 24px;">
      Diese E-Mail wurde automatisch versandt. Bitte nicht antworten.
    </p>
  </div>
</body>
</html>`
}

export function antragEntschiedenHtml(params: {
  antragTitel: string
  antragstellerName: string
  entscheidung: 'GENEHMIGT' | 'ABGELEHNT'
  antragId: string
}): string {
  const { antragTitel, antragstellerName, entscheidung, antragId } = params
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const farbe = entscheidung === 'GENEHMIGT' ? '#16a34a' : '#dc2626'
  const text = entscheidung === 'GENEHMIGT' ? 'genehmigt' : 'abgelehnt'

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Antrag ${text}</title>
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #f8f9fa; border-radius: 8px; padding: 24px;">
    <h1 style="color: ${farbe}; font-size: 24px;">Antrag ${text}</h1>
    <p>Guten Tag ${antragstellerName},</p>
    <p>Ihr Antrag <strong>${antragTitel}</strong> wurde <strong style="color: ${farbe};">${text}</strong>.</p>
    
    <a href="${appUrl}/antraege/${antragId}" 
       style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 16px;">
      Antrag ansehen
    </a>
    
    <p style="color: #999; font-size: 12px; margin-top: 24px;">
      Automatisch versandt vom CAS Starter Kit.
    </p>
  </div>
</body>
</html>`
}
