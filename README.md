# Gamex

**Balance Emotion. Unlock Connection.**

A multiplayer emotional fidget game where players secretly choose Love, Friendship, or Sex each round. Choices influence hidden averages that evolve until equilibrium (Bingo) is reached.

## Features

- **Multiplayer Bluetooth Connectivity**: Connect with nearby players using Web Bluetooth API
- **Three Game Modes**: Easy (5 rounds), Hard (8 rounds), Hardest (10 rounds)
- **Sequential Turn System**: Players take turns choosing emotions
- **Real-time Averages**: Track both global and individual player statistics
- **Bingo Detection**: Win when `average(Friendship + Sex) > average(Love)`
- **Safe Play Score**: Dynamic scoring system based on emotional balance
- **Immersive Visuals**: Canvas-based aura animations for each emotion
- **Web Audio API**: Procedurally generated sound effects
- **PWA Support**: Install on device, works offline
- **Haptic Feedback**: Vibration feedback for interactions

## Tech Stack

- HTML5
- CSS3 (Minimal aura aesthetic)
- Vanilla JavaScript (ES6+)
- Web Bluetooth API
- Web Audio API
- Canvas API
- Service Worker (PWA)
- Vibration API (Haptic feedback)

## Project Structure

```
gamex/
├── index.html              # Splash screen
├── lobby.html              # Player lobby and mode selection
├── game.html               # Game screen with emotion choices
├── results.html            # Results with progress bars
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── styles/
│   └── main.css           # Main stylesheet
├── js/
│   ├── audio.js           # Web Audio API sound effects
│   ├── animations.js      # Canvas aura animations
│   ├── bluetooth.js       # Bluetooth connectivity
│   └── game-logic.js      # Game mechanics and calculations
└── icons/
    ├── icon-192.png       # PWA icon (192x192)
    └── icon-512.png       # PWA icon (512x512)
```

## Getting Started

### Prerequisites

- Modern browser with Web Bluetooth support (Chrome, Edge, Opera)
- HTTPS connection (required for Bluetooth API)
- Local server for development

### Installation

1. Clone or download the repository
2. Serve the files using a local HTTPS server

#### Option 1: Using Python (with self-signed cert)
```bash
# Install http-server
npm install -g http-server

# Run with SSL
http-server -S -C cert.pem -K key.pem
```

#### Option 2: Using VS Code Live Server
- Install "Live Server" extension
- Right-click index.html and select "Open with Live Server"
- Make sure it's configured for HTTPS

#### Option 3: Deploy to GitHub Pages or Netlify
- Both provide HTTPS by default
- Simply push the code and it's ready to play

### Creating Icons

Create two icon files for the PWA:

```bash
# Create icons directory
mkdir -p icons

# You'll need to create:
# - icons/icon-192.png (192x192px)
# - icons/icon-512.png (512x512px)
```

You can use any graphic design tool or online generator to create simple icons with the Gamex branding colors:
- Red: #FF1744
- Yellow: #FFD740
- Magenta: #D500F9

## How to Play

1. **Start**: Open the app and enable Bluetooth
2. **Connect**: First player becomes host, scan for nearby players
3. **Select Mode**: Choose Easy, Hard, or Hardest mode
4. **Play**: Take turns choosing Love ❤️, Friendship 💛, or Sex 💜
5. **Watch Auras**: Experience subtle visual feedback for each choice
6. **Results**: View progress bars, Safe Play Score, and final outcome
7. **Bingo or Replay**: Win when Friendship + Sex averages exceed Love

## Game Mechanics

### Win Condition (Bingo)
- Minimum rounds must be completed
- `average(Friendship + Sex) > average(Love)`
- All three aura colors converge into white flash

### Replay Condition
- Love average dominates
- Minimum rounds not reached
- Background gradually shifts to red (emotional heat)

### Safe Play Score
- Formula: `100 - lovePercentage`
- **Safe** (60-100): Calm connection (Green)
- **Caution** (30-59): Emotional flux (Yellow)
- **Unsafe** (0-29): Overheated (Red)

## Customization

### Colors
Edit `styles/main.css`:
```css
:root {
    --bg-dark: #0A0A0A;
    --accent-love: #FF1744;
    --accent-friendship: #FFD740;
    --accent-sex: #D500F9;
}
```

### Sounds
Edit `js/audio.js` to modify Web Audio API synthesized sounds for each emotion.

### Animations
Edit `js/animations.js` to customize Canvas-based aura effects.

## Browser Compatibility

| Feature | Chrome | Edge | Opera | Firefox | Safari |
|---------|--------|------|-------|---------|--------|
| Web Bluetooth | ✅ | ✅ | ✅ | ❌ | ❌ |
| Web Audio | ✅ | ✅ | ✅ | ✅ | ✅ |
| Canvas | ✅ | ✅ | ✅ | ✅ | ✅ |
| PWA | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Haptics | ✅ | ✅ | ✅ | ❌ | ⚠️ |

**Note**: Web Bluetooth API is the main limitation. For best experience, use Chrome, Edge, or Opera on Android/Desktop.

## Future Enhancements

- WebRTC fallback for browsers without Bluetooth support
- Online multiplayer via WebSocket server
- Game history and statistics
- Custom game modes
- Achievement system
- Social sharing with custom graphics

## Known Limitations

1. **Web Bluetooth Peripheral Mode**: Web Bluetooth API doesn't support peripheral/server mode yet. Current implementation uses simulated connections for testing. For production with real Bluetooth:
   - Use native wrapper (Capacitor/Cordova)
   - Or implement WebRTC as alternative P2P connection

2. **Bluetooth Device Discovery**: Players need to manually scan for each other

3. **Browser Support**: Limited to Chromium-based browsers

## Troubleshooting

### Bluetooth Not Working
- Ensure HTTPS connection
- Grant Bluetooth permissions
- Check browser compatibility
- Enable Bluetooth on device

### Audio Not Playing
- Ensure user interaction first (tap screen)
- Check browser audio permissions
- Verify volume is not muted

### PWA Not Installing
- Ensure HTTPS connection
- Check manifest.json is valid
- Verify Service Worker is registered
- Try hard refresh (Ctrl+Shift+R)

## License

This project is open source and available for personal and educational use.

## Credits

Built with vanilla JavaScript, Web APIs, and modern browser technologies.

---

**Enjoy playing Gamex!** 🎮❤️💛💜
