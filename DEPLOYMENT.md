# Deployment Guide for Gamex

All file paths have been updated to relative paths (`./ `instead of `/`) to support deployment on GitHub Pages and other hosting platforms.

## GitHub Pages Deployment

### Option 1: Deploy from Repository Root

1. **Push your code to GitHub**
   ```bash
   cd /Users/syamnath/Desktop/Projects/Gamex
   git init
   git add .
   git commit -m "Initial commit - Gamex PWA"
   git branch -M main
   git remote add origin https://github.com/missionode/Gamex.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: Select "Deploy from branch"
   - Branch: Select "main" and "/ (root)"
   - Click Save

3. **Your site will be live at:**
   `https://missionode.github.io/Gamex/`

### Option 2: Deploy to Custom Domain

1. Add a `CNAME` file with your domain
2. Configure DNS settings for your domain
3. Enable HTTPS in GitHub Pages settings

## Alternative Hosting Options

### Netlify (Recommended for Easy HTTPS)

1. **Deploy via Drag & Drop**
   - Go to https://app.netlify.com/drop
   - Drag the entire Gamex folder
   - Get instant HTTPS URL

2. **Deploy via CLI**
   ```bash
   npm install -g netlify-cli
   cd /Users/syamnath/Desktop/Projects/Gamex
   netlify deploy
   ```

### Vercel

```bash
npm install -g vercel
cd /Users/syamnath/Desktop/Projects/Gamex
vercel
```

### Local Testing with HTTPS

**Required for Web Bluetooth API**

#### Using http-server:
```bash
# Install
npm install -g http-server

# Generate self-signed certificate (macOS/Linux)
openssl req -newkey rsa:2048 -new -nodes -x509 -days 365 -keyout key.pem -out cert.pem

# Run server
http-server -S -C cert.pem -K key.pem -p 8080

# Open in browser
# https://localhost:8080
```

#### Using Python:
```bash
# Python 3
python3 -m http.server 8080 --bind localhost
```
Note: Python doesn't support HTTPS easily, use http-server instead

## Before Deployment Checklist

- [x] All paths are relative (using `./`)
- [x] Service Worker configured
- [x] PWA manifest.json created
- [ ] Create icon files (192x192 and 512x512)
- [ ] Test on HTTPS (required for Bluetooth)
- [ ] Test PWA install prompt
- [ ] Test offline functionality

## Creating Icon Files

You need to create two PNG icons:

1. **192x192 pixels** - `icons/icon-192.png`
2. **512x512 pixels** - `icons/icon-512.png`

### Quick Icon Creation:

**Option 1: Online Tools**
- https://favicon.io/ (Easy PWA icon generator)
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

**Option 2: Design Software**
- Canva (free templates)
- Figma (free)
- Photoshop/GIMP

**Design Suggestions:**
- Use Gamex color palette:
  - Red: #FF1744
  - Yellow: #FFD740
  - Magenta: #D500F9
  - Background: #0A0A0A
- Keep it simple and recognizable
- Ensure it looks good at small sizes

**Temporary Placeholder:**
If you need to deploy quickly, create simple colored squares or use online generators.

## Testing After Deployment

1. **Test HTTPS**: Ensure site loads over HTTPS
2. **Test Bluetooth**: Try scanning for devices (requires 2+ devices)
3. **Test PWA Install**:
   - Chrome: Look for install icon in address bar
   - Mobile: "Add to Home Screen" option
4. **Test Offline**:
   - Disconnect internet
   - Reload page (should work from cache)
5. **Test Audio**: Tap buttons to hear sounds
6. **Test Haptics**: On mobile, feel vibrations

## Browser Requirements

- **Chrome/Edge/Opera**: Full support (Bluetooth works)
- **Firefox/Safari**: Partial support (no Bluetooth)

For best experience, use Chrome on Android or Desktop.

## Troubleshooting

### 404 Errors
- ✅ Fixed: All paths now use relative paths (`./`)

### Bluetooth Not Working
- Ensure HTTPS connection
- Use Chrome, Edge, or Opera
- Grant Bluetooth permissions when prompted

### Service Worker Not Registering
- Check browser console for errors
- Clear cache and hard reload (Ctrl+Shift+R)
- Ensure HTTPS

### Icons Not Showing
- Create the icon files in `icons/` folder
- Clear PWA cache
- Uninstall and reinstall the app

## Post-Deployment

After successful deployment:
1. Share the URL with testers
2. Test multiplayer with 2+ devices
3. Gather feedback
4. Iterate and improve

---

**Your Gamex PWA is ready to deploy!** 🎮
