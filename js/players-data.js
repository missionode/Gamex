/**
 * Player Data Generator for Gamex
 * Generates realistic Indian names and avatar URLs
 */

class PlayersDataGenerator {
    constructor() {
        // Indian names database
        this.maleNames = [
            'Arjun', 'Rohan', 'Aarav', 'Vivaan', 'Aditya',
            'Vihaan', 'Aryan', 'Sai', 'Advait', 'Arnav',
            'Dhruv', 'Kabir', 'Atharv', 'Shivansh', 'Reyansh',
            'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Rudra',
            'Pranav', 'Karan', 'Vedant', 'Lakshya', 'Yash',
            'Dev', 'Parth', 'Ansh', 'Harsh', 'Aayush'
        ];

        this.femaleNames = [
            'Ananya', 'Diya', 'Aarohi', 'Pari', 'Aanya',
            'Sara', 'Myra', 'Avni', 'Saanvi', 'Ira',
            'Navya', 'Kiara', 'Aditi', 'Riya', 'Tara',
            'Ishita', 'Prisha', 'Sia', 'Shanaya', 'Anika',
            'Meera', 'Kavya', 'Shriya', 'Nisha', 'Pooja',
            'Rhea', 'Zara', 'Kriti', 'Simran', 'Tanvi'
        ];

        // Avatar URLs using UI Avatars API or similar
        // Using a mix of male/female avatars
        this.usedNames = new Set();
    }

    /**
     * Generate avatar URL from name
     * Using DiceBear API with gender-specific styles
     */
    getAvatarUrl(name, gender) {
        const seed = name.toLowerCase();

        // Use different avatar styles for male and female
        // Male: 'adventurer' style with masculine features
        // Female: 'lorelei' or 'big-smile' style with feminine features

        if (gender === 'male') {
            // Adventurer style for males - more masculine appearance
            return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&hair=short01,short02,short03,short04,short05&facialHair=beard01,beard02,beard03,beard04,mustache`;
        } else {
            // Lorelei style for females - more feminine appearance
            return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=ffd1dc,e6e6fa,ffe4e1`;
        }
    }

    /**
     * Get random unique name
     */
    getRandomName(gender) {
        const namePool = gender === 'male' ? this.maleNames : this.femaleNames;
        let name;
        let attempts = 0;

        do {
            name = namePool[Math.floor(Math.random() * namePool.length)];
            attempts++;

            // If all names used, reset
            if (attempts > 100) {
                this.usedNames.clear();
            }
        } while (this.usedNames.has(name));

        this.usedNames.add(name);
        return name;
    }

    /**
     * Generate player data
     */
    generatePlayer(index) {
        // Randomly assign gender
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const name = this.getRandomName(gender);
        const avatarUrl = this.getAvatarUrl(name, gender);

        return {
            id: 'player_' + (index + 1),
            name: name,
            number: index + 1,
            gender: gender,
            avatar: avatarUrl,
            isAI: true
        };
    }

    /**
     * Generate multiple players
     */
    generatePlayers(count) {
        this.usedNames.clear();
        const players = [];

        for (let i = 0; i < count; i++) {
            players.push(this.generatePlayer(i));
        }

        return players;
    }

    /**
     * Reset used names
     */
    reset() {
        this.usedNames.clear();
    }
}
