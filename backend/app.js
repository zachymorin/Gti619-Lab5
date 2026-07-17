import express from 'express';
import path from 'path';
import { router } from './src/routes/routes.js';
import { fileURLToPath } from 'url';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
export const app = express();
 
app.use(express.static(path.join(__dirname, 'public')));
 
app.use('/api', router);
 