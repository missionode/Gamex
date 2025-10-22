# Avatar Styles Guide

## Gender-Specific Avatar Generation

Gamex now uses different DiceBear avatar styles based on player gender to create clear visual distinction.

## Male Players
- **Style:** Adventurer
- **Features:**
  - Masculine facial features
  - Short hairstyles
  - Facial hair options (beards, mustaches)
  - Blue-toned backgrounds
- **Color Palette:** `#b6e3f4, #c0aede, #d1d4f9` (blues and purples)
- **Example Names:** Arjun, Rohan, Aarav, Vivaan, Aditya, Vihaan, Aryan, etc.

## Female Players
- **Style:** Lorelei
- **Features:**
  - Feminine facial features
  - Various hairstyles with longer hair
  - No facial hair
  - Pink-toned backgrounds
- **Color Palette:** `#ffd1dc, #e6e6fa, #ffe4e1` (pinks and lavenders)
- **Example Names:** Ananya, Diya, Aarohi, Pari, Aanya, Sara, Myra, etc.

## Avatar Generation

Each avatar is generated using:
```
Male: https://api.dicebear.com/7.x/adventurer/svg?seed={name}
Female: https://api.dicebear.com/7.x/lorelei/svg?seed={name}
```

The seed is based on the player's name, ensuring:
- Consistency - Same name always generates same avatar
- Uniqueness - Different names generate different avatars
- Gender appropriateness - Visual style matches player gender

## Files Updated

1. **`js/players-data.js`** - Core avatar generation logic
2. **`select-player.html`** - Player selection screen with fallbacks
3. **`autoplay.html`** - Gameplay screen avatars
4. **`winner.html`** - Winner screen avatar display
5. **`test-players.html`** - Testing and verification

## Testing

Visit `http://localhost:8000/test-players.html` to see:
- Multiple players with mixed genders
- Visual distinction between male and female avatars
- Color-coded backgrounds (blue for male, pink for female)
- Gender symbols (♂️ for male, ♀️ for female)

## Fallback Logic

If primary avatar fails to load:
1. Attempt to reload with timestamp appended (cache busting)
2. Use same gender-appropriate style
3. Maintain visual consistency

## Benefits

✅ Clear visual gender distinction
✅ Realistic Indian names matched with appropriate avatars
✅ Consistent avatar generation (same name = same avatar)
✅ Professional appearance with DiceBear API
✅ No need for hosting custom images
✅ Automatic gender-based styling
