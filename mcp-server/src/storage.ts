import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory paths
const DATA_DIR = path.join(__dirname, '../../data');
const TEMPLATES_DIR = path.join(DATA_DIR, 'templates');
const CANVASES_DIR = path.join(DATA_DIR, 'canvases');
const SESSIONS_DIR = path.join(DATA_DIR, 'sessions');

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(TEMPLATES_DIR, { recursive: true });
  await fs.mkdir(path.join(TEMPLATES_DIR, 'custom'), { recursive: true });
  await fs.mkdir(CANVASES_DIR, { recursive: true });
  await fs.mkdir(SESSIONS_DIR, { recursive: true });
}

// Template storage
export async function saveTemplate(template: any) {
  await ensureDirectories();
  const filePath = path.join(TEMPLATES_DIR, 'custom', `${template.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(template, null, 2));
  await updateTemplateIndex();
}

export async function loadTemplate(templateId: string): Promise<any | null> {
  try {
    const filePath = path.join(TEMPLATES_DIR, 'custom', `${templateId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function loadAllTemplates(): Promise<any[]> {
  await ensureDirectories();
  const templates = [];
  
  // Load custom templates
  try {
    const files = await fs.readdir(path.join(TEMPLATES_DIR, 'custom'));
    for (const file of files) {
      if (file.endsWith('.json')) {
        const data = await fs.readFile(path.join(TEMPLATES_DIR, 'custom', file), 'utf-8');
        templates.push(JSON.parse(data));
      }
    }
  } catch {
    // Directory might not exist yet
  }
  
  return templates;
}

async function updateTemplateIndex() {
  const templates = await loadAllTemplates();
  const index = {
    count: templates.length,
    templates: templates.map(t => ({
      id: t.id,
      name: t.name,
      createdAt: t.createdAt,
    })),
  };
  await fs.writeFile(path.join(TEMPLATES_DIR, 'index.json'), JSON.stringify(index, null, 2));
}

// Canvas storage
export async function saveCanvas(canvas: any) {
  await ensureDirectories();
  const filePath = path.join(CANVASES_DIR, `${canvas.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(canvas, null, 2));
}

export async function loadCanvas(canvasId: string): Promise<any | null> {
  try {
    const filePath = path.join(CANVASES_DIR, `${canvasId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function loadAllCanvases(): Promise<any[]> {
  await ensureDirectories();
  const canvases = [];
  
  try {
    const files = await fs.readdir(CANVASES_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const data = await fs.readFile(path.join(CANVASES_DIR, file), 'utf-8');
        canvases.push(JSON.parse(data));
      }
    }
  } catch {
    // Directory might not exist yet
  }
  
  return canvases;
}

// Session storage
export async function saveSession(session: any) {
  await ensureDirectories();
  const filePath = path.join(SESSIONS_DIR, `${session.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(session, null, 2));
}

export async function getCurrentSession(): Promise<any | null> {
  try {
    const filePath = path.join(SESSIONS_DIR, 'current.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function setCurrentSession(session: any) {
  await ensureDirectories();
  const filePath = path.join(SESSIONS_DIR, 'current.json');
  await fs.writeFile(filePath, JSON.stringify(session, null, 2));
  await saveSession(session); // Also save as regular session
}