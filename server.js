const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, 'uploads');
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadDir));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: false },
  })
);

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.admin) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  next();
}

app.get('/api/media', (_req, res) => {
  const items = fs
    .readdirSync(uploadDir)
    .filter((file) => /\.(png|jpe?g|gif|webp|mp4|mov|webm)$/i.test(file))
    .map((file) => ({
      name: file,
      url: `/uploads/${encodeURIComponent(file)}`,
      type: /\.(mp4|mov|webm)$/i.test(file) ? 'video' : 'image',
    }));

  res.json({ items });
});

app.post('/api/login', (req, res) => {
  const password = process.env.ADMIN_PASSWORD || 'change-me';
  const supplied = String(req.body.password || '');

  if (supplied === password) {
    req.session.admin = true;
    return res.json({ ok: true });
  }

  return res.status(401).json({ ok: false, message: 'Invalid password' });
});

app.post('/api/upload', requireAdmin, upload.array('files', 50), (req, res) => {
  const files = req.files || [];
  res.json({ ok: true, uploaded: files.length, files: files.map((f) => ({ name: f.filename, url: `/uploads/${encodeURIComponent(f.filename)}` })) });
});

app.get('/api/status', (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.admin) });
});

app.get('/admin', (req, res) => {
  if (!req.session || !req.session.admin) {
    return res.redirect('/admin-login.html');
  }
  return res.sendFile(path.join(publicDir, 'admin.html'));
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Gallery server running at http://localhost:${PORT}`);
  console.log('Set ADMIN_PASSWORD in a .env file before production use.');
});
