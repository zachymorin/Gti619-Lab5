import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { router } from './src/routes/routes.js';
import { fileURLToPath } from 'url';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
export const app = express();
 
app.use(express.json()); // Pour lire le JSON dans req.body
app.use(cookieParser()); // Pour lire les cookies de session côté serveur
app.use(express.static(path.join(__dirname, 'public')));
 
app.use('/api', router);