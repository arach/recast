# Local Domain Setup

## Why Use a Local Domain?

Using `local.reflow.dev` instead of `localhost:3002` provides:
- Better OAuth redirect handling
- More production-like environment
- Easier to remember URLs
- Better cookie handling
- Cleaner development experience

## Setup Instructions

### macOS/Linux

Add this line to your `/etc/hosts` file:

```bash
sudo echo "127.0.0.1 local.reflow.dev" >> /etc/hosts
```

Or manually edit:
```bash
sudo nano /etc/hosts
```

Add:
```
127.0.0.1 local.reflow.dev
```

### Windows

1. Open Notepad as Administrator
2. Open `C:\Windows\System32\drivers\etc\hosts`
3. Add this line:
```
127.0.0.1 local.reflow.dev
```
4. Save the file

## Update OAuth Redirects

If you're using OAuth providers, update your redirect URIs:

### Google OAuth
In Google Cloud Console, add:
- `http://local.reflow.dev:3002/api/auth/callback/google`

### GitHub OAuth
In GitHub Developer Settings, update callback URL to:
- `http://local.reflow.dev:3002/api/auth/callback/github`

## Access Your Dev Environment

After setup, access ReFlow at:
```
http://local.reflow.dev:3002
```

## Troubleshooting

1. **Can't access local.reflow.dev**
   - Verify hosts file entry
   - Try flushing DNS: `sudo dscacheutil -flushcache` (macOS)
   - Restart your browser

2. **OAuth redirects failing**
   - Double-check redirect URIs match exactly
   - Include the port number (:3002)
   - Use http:// not https:// for local development

3. **Want a different domain?**
   - Change `NEXT_PUBLIC_APP_URL` in `.env.local`
   - Update your hosts file accordingly
   - Update OAuth redirect URIs