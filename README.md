# chillboyzclub-gallery

This project is a minimal local gallery and upload demo for `chillboyzclub.website`.

## Setup

1. Copy `.env.example` to `.env`.
2. Set your password in `.env`.
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm start
```

5. Open:
   - gallery: `http://localhost:3000/`
   - admin: `http://localhost:3000/admin`

## Notes

- The admin password is stored in `.env` locally, not in public code.
- The gallery currently renders uploaded images and videos from the `uploads/` folder.
- This is a local server demo. For real public hosting, do not expose the admin panel on the same public site without proper authentication and secure hosting.

## Production warning

Avoid hardcoding secrets in public Git repositories. Store credentials in a private environment or managed secret store. The exact password can be changed at any time in `.env`.
