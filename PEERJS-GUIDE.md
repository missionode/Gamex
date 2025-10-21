# PeerJS Multiplayer Guide

Gamex now uses **PeerJS** for peer-to-peer multiplayer connections. No database or backend required!

## ✨ What Changed

### Before (Bluetooth):
- ❌ Limited browser support (Chrome only)
- ❌ Couldn't advertise as server
- ❌ Local network only
- ❌ Complex pairing process

### After (PeerJS):
- ✅ Works on all modern browsers
- ✅ Works across internet (not just local network)
- ✅ Simple room code system
- ✅ Free PeerJS Cloud service
- ✅ No backend needed!

## 🎮 How It Works Now

### For Moderator (Room Creator):

1. **Open Gamex**
2. **Enter your name**
3. **Click "CREATE ROOM"**
4. **Share the room code** with other players (copy button provided)
5. **Wait for players to join**
6. **Select game mode** (Easy/Hard/Hardest)
7. **Click "START GAME"** when ready

### For Players (Room Joiners):

1. **Open Gamex**
2. **Enter your name**
3. **Get room code** from moderator
4. **Enter code** in "Join Existing Room"
5. **Click "JOIN"**
6. **Wait for moderator** to start game
7. **See selected mode** (moderator controls this)

## 🔑 New Features

### ✅ All Your Requirements Implemented:

1. **Player Name Customization** ✅
   - Enter your name before creating/joining room
   - Can be updated anytime in lobby
   - Syncs across all players

2. **First Player = Moderator** ✅
   - Room creator automatically becomes moderator
   - Gets special "MODERATOR" badge
   - Has exclusive controls

3. **Moderator Controls Game Mode** ✅
   - Only moderator can select mode
   - Other players see selected mode in real-time
   - Mode syncs to all players

4. **Only Moderator Sees Start Button** ✅
   - Other players cannot start game
   - Clear visual distinction

5. **Room Code System** ✅
   - Easy to share
   - Copy button for convenience
   - Works across internet

## 🎯 Game Flow

```
Moderator Side:
1. Create Room → Get Code
2. Share Code with Friends
3. Wait for Players
4. Select Mode
5. Start Game

Player Side:
1. Get Code from Moderator
2. Join Room
3. See Other Players Join
4. See Mode Selected by Moderator
5. Wait for Game to Start
```

## 🔧 Technical Details

### PeerJS Connection:
- Uses free PeerJS Cloud servers
- Peer-to-peer after initial connection
- WebRTC for data transmission
- No data stored on servers

### Room Code:
- Based on PeerJS peer ID
- Unique for each session
- Expires when moderator closes page

### Data Sync:
- Player list synced by moderator
- Game mode broadcast to all
- Choices relayed through peers
- Real-time updates

## 🚀 Testing Multiplayer

### Local Testing (Same Computer):

1. Open **two browser windows/tabs**
2. In **Window 1**: Create room, copy code
3. In **Window 2**: Join with code
4. Test gameplay

### Remote Testing (Different Devices):

1. **Deploy to GitHub Pages** or any HTTPS host
2. **Moderator**: Create room on Device 1
3. **Players**: Join room on Device 2, 3, etc.
4. Works across internet!

### Testing Checklist:

- [ ] Create room successfully
- [ ] Copy room code
- [ ] Join room with code
- [ ] See player names update
- [ ] Moderator selects mode
- [ ] Players see mode update
- [ ] Start game as moderator
- [ ] All players transition to game
- [ ] Take turns correctly
- [ ] Game completes successfully

## ⚠️ Known Limitations

### Room Codes:
- Currently uses full PeerJS peer ID (long string)
- Future: Can implement shorter codes with mapping service

### Mid-Game Joins:
- Not yet implemented
- Players must join before game starts
- Future enhancement planned

### Moderator Disconnect:
- If moderator leaves, room closes
- Future: Can implement moderator transfer

## 🔮 Future Enhancements

Possible additions:

1. **Shorter Room Codes**
   - 6-digit codes instead of long IDs
   - Requires small Firebase/Supabase mapping

2. **Mid-Game Joins**
   - Join ongoing games as spectator
   - Or join next round

3. **Room Persistence**
   - Reconnect to same room
   - Resume interrupted games

4. **Chat System**
   - Text messages between players
   - Emoji reactions

5. **Game History**
   - Save results locally
   - Share via Web Share API

## 📝 Code Structure

```
js/peer-manager.js      - PeerJS connection handling
lobby.html              - Room creation/joining UI
game.html              - Game play (needs PeerJS integration)
results.html           - Results display

Key Classes:
- PeerManager           - Handles all P2P communication
- Events: playerJoined, playerDisconnected,
          modeSelected, gameStarted, etc.
```

## 🐛 Troubleshooting

### "Failed to initialize"
- Check internet connection
- PeerJS Cloud might be down (rare)
- Try refreshing page

### "Failed to join room"
- Check room code is correct
- Moderator must be connected
- Code expires when moderator leaves

### Players not syncing
- Check browser console for errors
- Ensure all players on same game version
- Try refreshing all browsers

### Game not starting
- Need minimum 2 players
- Only moderator can start
- Check all players connected

## 📱 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Edge    | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Opera   | ✅ Full |
| Mobile  | ✅ Full |

Much better than Bluetooth! 🎉

## 🎓 For Developers

### Sending Messages:

```javascript
// Moderator broadcasts
peerManager.broadcast({
    type: 'custom',
    data: 'value'
});

// Players receive
peerManager.on('messageType', (data) => {
    console.log(data);
});
```

### Available Events:

- `playerJoined` - New player connected
- `playerDisconnected` - Player left
- `playerNameUpdated` - Name changed
- `modeSelected` - Mode changed
- `gameStarted` - Game beginning
- `choiceReceived` - Player made choice
- `nextTurn` - Turn changed
- `gameOver` - Game ended

### Adding New Features:

1. Define new message type in `peer-manager.js`
2. Add handler in `handleReceivedData()`
3. Create event emitter
4. Listen in UI code

---

**Enjoy the new multiplayer system!** 🎮🌐
