#!/usr/bin/env node
// setup-skills.js
// Legt Tool-Bridges als Symlinks/Junctions auf .agents/skills/ an.
// Einmalig nach git clone ausführen: npm run setup:skills
// Hintergrund: .agents/skills/ ist die kanonische Agent-Skills-Quelle.
// Claude Code liest aktuell .claude/skills/, aktuelle Kilo-Versionen lesen .kilo/skills/ zuverlässiger.

const fs = require('fs');
const path = require('path');

const target = path.resolve('.agents/skills');

const bridges = [
  {
    tool: 'Claude Code',
    dir: path.resolve('.claude'),
    link: path.resolve('.claude/skills'),
    nativePath: '.claude/skills',
  },
  {
    tool: 'Kilo Code',
    dir: path.resolve('.kilo'),
    link: path.resolve('.kilo/skills'),
    nativePath: '.kilo/skills',
  },
];

if (!fs.existsSync(target)) {
  console.error('Fehler: .agents/skills/ existiert nicht. Bitte Skills zuerst im Repo bereitstellen.');
  process.exit(1);
}

for (const bridge of bridges) {
  if (!fs.existsSync(bridge.dir)) {
    fs.mkdirSync(bridge.dir, { recursive: true });
    console.log(`✓ ${path.relative(process.cwd(), bridge.dir)} Verzeichnis angelegt`);
  }

  if (fs.existsSync(bridge.link)) {
    console.log(`✓ ${bridge.nativePath} bereits vorhanden – kein Setup nötig`);
  } else {
    // 'junction' ermöglicht Symlinks auf Verzeichnisse unter Windows ohne Admin-Rechte
    fs.symlinkSync(target, bridge.link, 'junction');
    console.log(`✓ ${bridge.nativePath} → .agents/skills (Symlink/Junction für ${bridge.tool} angelegt)`);
  }
}

console.log('\nSetup abgeschlossen. Skills sind nun in allen Tools verfügbar:');
console.log('  Kilo Code:                         .kilo/skills/ (Bridge)');
console.log('  Claude Code:                       .claude/skills/ (Bridge)');
console.log('  Antigravity, VS Code, Codex:       .agents/skills/ (Standard-Pfad)');
