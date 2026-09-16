import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing Key:', apiKey);
  const genAI = new GoogleGenerativeAI(apiKey!);
  
  for (const modelName of ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash-latest']) {
    try {
      console.log(`Trying ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const res = await model.generateContent('Hello, reply with 1 sentence.');
      console.log(`SUCCESS with ${modelName}:`, res.response.text());
      return;
    } catch (err: any) {
      console.log(`Error with ${modelName}:`, err.message);
    }
  }
}

testGeminiModels();
