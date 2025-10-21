# Gamex Testing Guide

Complete guide to test the new PeerJS multiplayer system.

## 🧪 Quick Local Test (Same Computer)

### Step 1: Open Two Browser Windows

1. Open Chrome/Edge (recommended)
2. Open **Window 1** (Moderator)
3. Open **Window 2** (Player)

### Step 2: Create Room (Window 1)

1. Navigate to `index.html` or your deployed URL
2. Click **START**
3. Enter your name (e.g., "Alice")
4. Click **CREATE ROOM**
5. **Copy the room code** that appears

### Step 3: Join Room (Window 2)

1. Navigate to same URL
2. Click **START**
3. Enter different name (e.g., "Bob")
4. **Paste room code** in "Join Existing Room"
5. Click **JOIN**

### Step 4: Verify Connection

Both windows should now show:
- ✅ Player count: 2
- ✅ Both player names
- ✅ Moderator badge on first player
- ✅ Mode controls active for moderator only

### Step 5: Start Game (Window 1 - Moderator)

1. Select game mode (Easy/Hard/Hardest)
2. Verify Window 2 sees mode update
3. Click **START GAME**
4. Both windows transition to game screen

### Step 6: Play Game

**Window 1 (Alice's turn):**
- See emotion buttons enabled
- Choose Love/Friendship/Sex
- See waiting screen

**Window 2 (Bob's turn):**
- See waiting screen initially
- Then emotion buttons enabled
- Choose emotion
- See waiting screen

Continue alternating until game ends.

### Step 7: View Results

Both windows should:
- Show same global averages
- Show individual player stats
- Display BINGO or REPLAY result
- Show Safe Play Score

## 🌐 Remote Testing (Different Devices)

### Prerequisites

1. **Deploy to GitHub Pages or Netlify**
2. Ensure HTTPS (required for PeerJS)
3. Get shareable URL

### Testing Steps

**Device 1 (Moderator):**
1. Open deployed URL
2. Create room
3. Share room code via WhatsApp/SMS/etc.

**Device 2+ (Players):**
1. Open same URL
2. Join with room code
3. Wait for moderator to start

**Moderator:**
- Select mode
- Start game when all joined

**All Players:**
- Take turns choosing emotions
- See game progress
- View final results

## ✅ Testing Checklist

### Lobby Screen

- [ ] Enter player name
- [ ] Create room generates code
- [ ] Copy code button works
- [ ] Join room with valid code works
- [ ] Invalid code shows error
- [ ] Player list updates in real-time
- [ ] Moderator badge appears
- [ ] Mode selection (moderator only)
- [ ] Mode syncs to all players
- [ ] Start button (moderator only)
- [ ] Start button disabled until 2+ players

### Game Screen

- [ ] Correct player turn shown
- [ ] Emotion buttons enabled for current player
- [ ] Other players see waiting screen
- [ ] Choice triggers animation/sound
- [ ] Turn advances after choice
- [ ] Round counter updates correctly
- [ ] All players take equal turns
- [ ] Game ends after total rounds
- [ ] Bingo/Replay animation plays

### Results Screen

- [ ] Global averages displayed
- [ ] Individual player stats shown
- [ ] Checkbox toggles visibility
- [ ] Safe Play Score calculated
- [ ] Color coding (green/yellow/red)
- [ ] BINGO or REPLAY message
- [ ] Play Again works
- [ ] Share Results works
- [ ] Back to Lobby works

### PeerJS Functionality

- [ ] Connection established
- [ ] Room code copied successfully
- [ ] Players join in real-time
- [ ] Name updates sync
- [ ] Mode selection syncs
- [ ] Game start syncs
- [ ] Choices relay correctly
- [ ] Turn updates sync
- [ ] Game over syncs
- [ ] No duplicate choices
- [ ] No skipped turns

## 🐛 Common Issues & Fixes

### Issue: "Failed to initialize"

**Cause:** PeerJS Cloud connection issue

**Fix:**
- Check internet connection
- Refresh page
- Try different browser
- Check browser console for errors

### Issue: "Failed to join room"

**Cause:** Invalid code or moderator disconnected

**Fix:**
- Verify room code is correct
- Ensure moderator is still connected
- Try creating new room

### Issue: Players not syncing

**Cause:** Connection lost or timing issue

**Fix:**
- Check all players have stable internet
- Refresh all browsers
- Start new game

### Issue: Turns not advancing

**Cause:** Choice not received by moderator

**Fix:**
- Only moderator processes turns
- Check moderator's connection
- Verify choices are being sent

### Issue: Game stuck on waiting

**Cause:** Current player disconnected or UI bug

**Fix:**
- Check current player's connection
- Refresh affected player's browser
- Moderator may need to restart

## 🔍 Debug Mode

### Enable Console Logging

Open browser console (F12) to see:

```
Peer ID: abc123...
Room created: abc123
Connected to moderator
Choice received: {emotion: "love", playerId: "..."}
Next turn: {currentPlayerIndex: 1}
```

### Expected Log Flow

**Moderator:**
```
1. Peer ID: [id]
2. Room created: [id]
3. Incoming connection from: [player_id]
4. Choice received: [data]
5. Broadcasting next turn
```

**Player:**
```
1. Peer ID: [id]
2. Connecting to room...
3. Connected to moderator
4. Mode selected: hard
5. Game started
6. Choice sent
7. Next turn received
```

## 📊 Test Scenarios

### Scenario 1: Quick 2-Player Game

- 2 players
- Easy mode (5 rounds)
- Complete game
- Verify results

### Scenario 2: Multi-Player Game

- 3+ players
- Hard mode (8 rounds)
- Test turn rotation
- Verify equal distribution

### Scenario 3: Mode Synchronization

- Create room
- Player joins
- Moderator changes mode multiple times
- Verify player sees updates

### Scenario 4: Player Disconnect

- Start game with 3 players
- One player closes tab mid-game
- Verify game continues (if possible)
- Check error handling

### Scenario 5: Rapid Play

- 2 players
- Make choices quickly
- Test for race conditions
- Verify turn order maintained

## 📱 Browser Testing Matrix

| Browser | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Chrome  | ✅ | ✅ | Recommended |
| Edge    | ✅ | ✅ | Recommended |
| Firefox | ✅ | ✅ | Supported |
| Safari  | ✅ | ✅ | Supported |
| Opera   | ✅ | ✅ | Supported |

## 🎯 Performance Testing

### Network Conditions

Test with:
- Fast WiFi (optimal)
- Mobile 4G/5G (good)
- Slow 3G (acceptable)
- Intermittent connection (edge case)

### Player Count

Test with:
- 2 players (minimum)
- 3 players (typical)
- 4 players (good)
- 5+ players (stress test)

## 📝 Bug Reporting Template

If you find bugs, report with:

```markdown
**Issue:** [Brief description]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected:** [What should happen]

**Actual:** [What actually happened]

**Environment:**
- Browser: [Chrome 120]
- Device: [Desktop/Mobile]
- Players: [2/3/4]
- Mode: [Easy/Hard/Hardest]

**Console Errors:**
[Paste any errors from browser console]
```

## 🚀 Next Steps After Testing

Once testing is complete:

1. **Fix any bugs found**
2. **Deploy to production**
3. **Share with friends**
4. **Gather feedback**
5. **Iterate and improve**

---

**Happy Testing!** 🎮✨
