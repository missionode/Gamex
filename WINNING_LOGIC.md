# Gamex - Winning Logic Documentation

## BINGO Winning Condition

The game continues until **BINGO** is achieved. BINGO happens when the **watching player** (the player you selected to follow) satisfies BOTH of these conditions:

### Win Conditions:
1. **Friendship % > Love %**
2. **Sex % > Love %**

Both conditions must be true for the watching player specifically, not the global averages.

## How It Works

### Game Flow:
1. User selects number of players (2-10)
2. User selects difficulty (Easy/Hard/Hardest) which sets minimum rounds
3. User selects which player to watch
4. Game auto-plays with all players making random emotion choices
5. After minimum rounds are completed, the game checks BINGO condition after each turn
6. Game continues until the **watching player** has both Friendship > Love AND Sex > Love

### Example Winning Scenario:

**Watching Player: Arjun**

After 12 rounds:
- Love: 28.5%
- Friendship: 35.7% ✓ (Greater than Love)
- Sex: 35.8% ✓ (Greater than Love)

**Result:** BINGO! 🎉

### Example Losing Scenario (Continues Playing):

**Watching Player: Ananya**

After 8 rounds:
- Love: 45.2%
- Friendship: 32.1% ✗ (Less than Love)
- Sex: 22.7% ✗ (Less than Love)

**Result:** Game continues... "Love burns too bright; cool down to connect."

## Why This Design?

This creates an interesting dynamic where:
- You're watching one player's journey specifically
- The game has tension as you wait for their stats to align
- Different players may have different patterns
- The watching player's choices matter most for winning

## Debugging

Check the browser console (F12) during gameplay to see:
- Each round's stats for the watching player
- BINGO check results
- Reason messages when BINGO is not achieved

## Code References

- **Game Logic:** `js/game-logic.js` - `checkBingo()` function (line 79-139)
- **Autoplay:** `autoplay.html` - BINGO checking (line 361-379)
- **Winner Display:** `winner.html` - Shows which stats won (line 350-382)
