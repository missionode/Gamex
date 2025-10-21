/**
 * Game Logic for Gamex
 * Handles turns, averages calculation, and bingo detection
 */

class GameLogic {
    constructor() {
        this.emotionTypes = ['love', 'friendship', 'sex'];
    }

    /**
     * Update averages after each choice
     */
    updateAverages(gameState) {
        const { choices, players, averages } = gameState;

        // Count emotions for each player
        const playerCounts = {};
        players.forEach(player => {
            playerCounts[player.id] = {
                love: 0,
                friendship: 0,
                sex: 0,
                total: 0
            };
        });

        // Global counts
        let globalCounts = {
            love: 0,
            friendship: 0,
            sex: 0,
            total: 0
        };

        // Count all choices
        choices.forEach(choice => {
            const emotion = choice.emotion;

            // Update player counts
            if (playerCounts[choice.playerId]) {
                playerCounts[choice.playerId][emotion]++;
                playerCounts[choice.playerId].total++;
            }

            // Update global counts
            globalCounts[emotion]++;
            globalCounts.total++;
        });

        // Calculate individual averages
        players.forEach(player => {
            const counts = playerCounts[player.id];
            if (counts.total > 0) {
                averages.individual[player.id] = {
                    love: (counts.love / counts.total) * 100,
                    friendship: (counts.friendship / counts.total) * 100,
                    sex: (counts.sex / counts.total) * 100
                };
            }
        });

        // Calculate global averages
        if (globalCounts.total > 0) {
            averages.global = {
                love: (globalCounts.love / globalCounts.total) * 100,
                friendship: (globalCounts.friendship / globalCounts.total) * 100,
                sex: (globalCounts.sex / globalCounts.total) * 100
            };
        }

        return averages;
    }

    /**
     * Check if bingo condition is met
     * Bingo: average(Friendship + Sex) > average(Love)
     */
    checkBingo(gameState) {
        const { averages, totalRounds, choices, players } = gameState;
        const minRoundsCompleted = Math.floor(choices.length / players.length);

        // Check if minimum rounds are met
        if (minRoundsCompleted < totalRounds) {
            return {
                isBingo: false,
                reason: 'Minimum rounds not reached.'
            };
        }

        const { love, friendship, sex } = averages.global;

        // Calculate average of Friendship + Sex
        const friendshipSexAverage = (friendship + sex) / 2;

        // Check bingo condition
        if (friendshipSexAverage > love) {
            return {
                isBingo: true,
                reason: 'Equilibrium achieved — perfect resonance!',
                details: {
                    love,
                    friendship,
                    sex,
                    friendshipSexAverage
                }
            };
        } else {
            // Determine specific reason for replay
            let reason = 'The balance hasn\'t settled yet. Keep looping.';

            if (love > friendship && love > sex) {
                reason = 'Love burns too bright; cool down to connect.';
            } else if (love > friendshipSexAverage) {
                reason = 'Friendship must rise before passion aligns.';
            }

            return {
                isBingo: false,
                reason,
                details: {
                    love,
                    friendship,
                    sex,
                    friendshipSexAverage
                }
            };
        }
    }

    /**
     * Calculate Safe Play Score
     * Formula: SafeScore = 100 - (LoveAvg * 100 / TotalRounds)
     * Note: Adjusted formula to use percentage-based calculation
     */
    calculateSafeScore(gameState) {
        const { averages } = gameState;
        const lovePercentage = averages.global.love;

        // Calculate safe score (inverse of love percentage)
        const score = 100 - lovePercentage;

        // Determine category and label
        let category, label, color;

        if (score >= 60) {
            category = 'safe';
            label = 'Calm connection';
            color = '#00C853';
        } else if (score >= 30) {
            category = 'caution';
            label = 'Emotional flux';
            color = '#FFD600';
        } else {
            category = 'unsafe';
            label = 'Overheated';
            color = '#D50000';
        }

        return {
            score,
            category,
            label,
            color
        };
    }

    /**
     * Get current player's turn
     */
    getCurrentPlayer(gameState) {
        const { players, currentPlayerIndex } = gameState;
        return players[currentPlayerIndex];
    }

    /**
     * Get next player
     */
    getNextPlayer(gameState) {
        const { players, currentPlayerIndex } = gameState;
        const nextIndex = (currentPlayerIndex + 1) % players.length;
        return players[nextIndex];
    }

    /**
     * Check if it's a specific player's turn
     */
    isPlayerTurn(gameState, playerId) {
        const currentPlayer = this.getCurrentPlayer(gameState);
        return currentPlayer.id === playerId;
    }

    /**
     * Get game progress
     */
    getProgress(gameState) {
        const { choices, players, totalRounds } = gameState;
        const completedRounds = Math.floor(choices.length / players.length);
        const percentage = (completedRounds / totalRounds) * 100;

        return {
            completedRounds,
            totalRounds,
            percentage,
            remainingRounds: totalRounds - completedRounds
        };
    }

    /**
     * Get player statistics
     */
    getPlayerStats(gameState, playerId) {
        const playerChoices = gameState.choices.filter(c => c.playerId === playerId);
        const averages = gameState.averages.individual[playerId];

        return {
            totalChoices: playerChoices.length,
            choices: playerChoices,
            averages: averages || { love: 0, friendship: 0, sex: 0 }
        };
    }

    /**
     * Get game summary
     */
    getGameSummary(gameState) {
        const result = this.checkBingo(gameState);
        const safeScore = this.calculateSafeScore(gameState);
        const progress = this.getProgress(gameState);

        return {
            result,
            safeScore,
            progress,
            globalAverages: gameState.averages.global,
            individualAverages: gameState.averages.individual,
            totalChoices: gameState.choices.length
        };
    }

    /**
     * Validate game state
     */
    validateGameState(gameState) {
        const errors = [];

        if (!gameState.players || gameState.players.length < 2) {
            errors.push('Need at least 2 players');
        }

        if (!gameState.mode || !['easy', 'hard', 'hardest'].includes(gameState.mode)) {
            errors.push('Invalid game mode');
        }

        if (!gameState.totalRounds || gameState.totalRounds < 1) {
            errors.push('Invalid total rounds');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Calculate equal distribution of rounds
     */
    calculateRoundsPerPlayer(totalRounds, playerCount) {
        const baseRounds = Math.floor(totalRounds / playerCount);
        const remainder = totalRounds % playerCount;

        // Distribute rounds equally
        const distribution = [];
        for (let i = 0; i < playerCount; i++) {
            distribution.push(baseRounds + (i < remainder ? 1 : 0));
        }

        return distribution;
    }

    /**
     * Get replay narrative based on game state
     */
    getReplayNarrative(gameState) {
        const { love, friendship, sex } = gameState.averages.global;
        const narratives = [
            'You\'re close, but the aura isn\'t balanced yet.',
            'Love burns too bright; cool down to connect.',
            'Friendship must rise before passion aligns.'
        ];

        if (love > friendship && love > sex) {
            return narratives[1];
        } else if (friendship < sex) {
            return narratives[2];
        } else {
            return narratives[0];
        }
    }

    /**
     * Get emotion distribution
     */
    getEmotionDistribution(choices) {
        const distribution = {
            love: 0,
            friendship: 0,
            sex: 0
        };

        choices.forEach(choice => {
            distribution[choice.emotion]++;
        });

        return distribution;
    }

    /**
     * Get most chosen emotion
     */
    getMostChosenEmotion(choices) {
        const distribution = this.getEmotionDistribution(choices);
        let maxEmotion = 'love';
        let maxCount = 0;

        for (const [emotion, count] of Object.entries(distribution)) {
            if (count > maxCount) {
                maxCount = count;
                maxEmotion = emotion;
            }
        }

        return {
            emotion: maxEmotion,
            count: maxCount,
            percentage: choices.length > 0 ? (maxCount / choices.length) * 100 : 0
        };
    }

    /**
     * Get least chosen emotion
     */
    getLeastChosenEmotion(choices) {
        const distribution = this.getEmotionDistribution(choices);
        let minEmotion = 'love';
        let minCount = Infinity;

        for (const [emotion, count] of Object.entries(distribution)) {
            if (count < minCount) {
                minCount = count;
                minEmotion = emotion;
            }
        }

        return {
            emotion: minEmotion,
            count: minCount,
            percentage: choices.length > 0 ? (minCount / choices.length) * 100 : 0
        };
    }
}
