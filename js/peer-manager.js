/**
 * PeerJS Manager for Gamex
 * Handles peer-to-peer connections using PeerJS Cloud
 */

class PeerManager {
    constructor() {
        this.peer = null;
        this.connections = new Map();
        this.roomCode = null;
        this.isModerator = false;
        this.localPlayerId = null;
        this.localPlayerName = 'Player';
        this.eventHandlers = {};
        this.isInitialized = false;
    }

    /**
     * Initialize PeerJS
     */
    async initialize(playerName) {
        return new Promise((resolve, reject) => {
            try {
                this.localPlayerName = playerName || 'Player';

                // Create peer with PeerJS cloud server (free)
                this.peer = new Peer({
                    config: {
                        iceServers: [
                            { urls: 'stun:stun.l.google.com:19302' },
                            { urls: 'stun:stun1.l.google.com:19302' }
                        ]
                    }
                });

                // Handle peer open event
                this.peer.on('open', (id) => {
                    console.log('Peer ID:', id);
                    this.localPlayerId = id;
                    this.isInitialized = true;
                    resolve(id);
                });

                // Handle incoming connections
                this.peer.on('connection', (conn) => {
                    this.handleIncomingConnection(conn);
                });

                // Handle errors
                this.peer.on('error', (err) => {
                    console.error('Peer error:', err);
                    this.emit('error', { message: err.message, type: err.type });

                    if (!this.isInitialized) {
                        reject(err);
                    }
                });

                // Handle disconnection
                this.peer.on('disconnected', () => {
                    console.log('Peer disconnected');
                    this.emit('disconnected');
                });

                // Handle close
                this.peer.on('close', () => {
                    console.log('Peer connection closed');
                    this.emit('closed');
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Create room as moderator
     */
    createRoom() {
        if (!this.peer || !this.localPlayerId) {
            throw new Error('Peer not initialized');
        }

        this.isModerator = true;
        this.roomCode = this.generateRoomCode(this.localPlayerId);

        console.log('Room created:', this.roomCode);

        return {
            roomCode: this.roomCode,
            playerId: this.localPlayerId,
            playerName: this.localPlayerName,
            isModerator: true
        };
    }

    /**
     * Join room as guest
     */
    async joinRoom(roomCode) {
        if (!this.peer || !this.localPlayerId) {
            throw new Error('Peer not initialized');
        }

        this.isModerator = false;
        this.roomCode = roomCode;

        // Extract moderator's peer ID from room code
        const moderatorId = this.extractPeerIdFromRoomCode(roomCode);

        if (!moderatorId) {
            throw new Error('Invalid room code');
        }

        // Connect to moderator
        return new Promise((resolve, reject) => {
            try {
                const conn = this.peer.connect(moderatorId, {
                    reliable: true,
                    metadata: {
                        playerId: this.localPlayerId,
                        playerName: this.localPlayerName,
                        timestamp: Date.now()
                    }
                });

                conn.on('open', () => {
                    console.log('Connected to moderator');
                    this.setupConnection(conn);

                    // Send join request
                    this.sendToConnection(conn, {
                        type: 'join',
                        playerId: this.localPlayerId,
                        playerName: this.localPlayerName
                    });

                    resolve({
                        connected: true,
                        roomCode: this.roomCode
                    });
                });

                conn.on('error', (err) => {
                    console.error('Connection error:', err);
                    reject(new Error('Failed to connect to room. Please check the room code.'));
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Handle incoming connection (moderator side)
     */
    handleIncomingConnection(conn) {
        console.log('Incoming connection from:', conn.peer);

        this.setupConnection(conn);

        conn.on('open', () => {
            console.log('Connection established with:', conn.peer);

            // Send welcome message
            this.sendToConnection(conn, {
                type: 'welcome',
                moderatorId: this.localPlayerId,
                moderatorName: this.localPlayerName
            });
        });
    }

    /**
     * Setup connection event handlers
     */
    setupConnection(conn) {
        // Store connection
        this.connections.set(conn.peer, conn);

        // Handle data
        conn.on('data', (data) => {
            this.handleReceivedData(data, conn.peer);
        });

        // Handle close
        conn.on('close', () => {
            console.log('Connection closed:', conn.peer);
            this.connections.delete(conn.peer);
            this.emit('playerDisconnected', { playerId: conn.peer });
        });

        // Handle error
        conn.on('error', (err) => {
            console.error('Connection error:', err);
            this.emit('connectionError', { playerId: conn.peer, error: err });
        });
    }

    /**
     * Handle received data
     */
    handleReceivedData(data, fromPeerId) {
        console.log('Received data from', fromPeerId, ':', data);

        switch (data.type) {
            case 'join':
                // Guest is requesting to join
                this.emit('playerJoined', {
                    playerId: data.playerId,
                    playerName: data.playerName,
                    isLocal: false
                });
                break;

            case 'welcome':
                // Moderator welcomed us
                this.emit('welcomed', {
                    moderatorId: data.moderatorId,
                    moderatorName: data.moderatorName
                });
                break;

            case 'playerList':
                // Moderator sent updated player list
                this.emit('playerListUpdated', data.players);
                break;

            case 'gameStart':
                // Game is starting
                this.emit('gameStarted', data.gameState);
                break;

            case 'choice':
                // Player made a choice
                this.emit('choiceReceived', {
                    playerId: data.playerId,
                    emotion: data.emotion,
                    round: data.round
                });
                break;

            case 'nextTurn':
                // Next player's turn
                this.emit('nextTurn', {
                    currentPlayerIndex: data.currentPlayerIndex,
                    currentPlayerId: data.currentPlayerId
                });
                break;

            case 'gameOver':
                // Game ended
                this.emit('gameOver', data.result);
                break;

            case 'nameUpdate':
                // Player updated their name
                this.emit('playerNameUpdated', {
                    playerId: data.playerId,
                    playerName: data.playerName
                });
                break;

            case 'modeSelected':
                // Moderator selected game mode
                this.emit('modeSelected', {
                    mode: data.mode,
                    rounds: data.rounds
                });
                break;

            default:
                console.warn('Unknown message type:', data.type);
        }
    }

    /**
     * Send data to specific connection
     */
    sendToConnection(conn, data) {
        if (conn && conn.open) {
            conn.send(data);
        }
    }

    /**
     * Broadcast to all connections
     */
    broadcast(data) {
        this.connections.forEach((conn) => {
            this.sendToConnection(conn, data);
        });
    }

    /**
     * Update player name
     */
    updatePlayerName(newName) {
        this.localPlayerName = newName;

        // Broadcast name update
        this.broadcast({
            type: 'nameUpdate',
            playerId: this.localPlayerId,
            playerName: newName
        });
    }

    /**
     * Send player list update (moderator only)
     */
    sendPlayerList(players) {
        if (!this.isModerator) return;

        this.broadcast({
            type: 'playerList',
            players: players
        });
    }

    /**
     * Start game (moderator only)
     */
    startGame(gameState) {
        if (!this.isModerator) return;

        this.broadcast({
            type: 'gameStart',
            gameState: gameState
        });
    }

    /**
     * Send game mode selection (moderator only)
     */
    selectGameMode(mode, rounds) {
        if (!this.isModerator) return;

        this.broadcast({
            type: 'modeSelected',
            mode: mode,
            rounds: rounds
        });
    }

    /**
     * Send choice during game
     */
    sendChoice(emotion, round) {
        const data = {
            type: 'choice',
            playerId: this.localPlayerId,
            playerName: this.localPlayerName,
            emotion: emotion,
            round: round,
            timestamp: Date.now()
        };

        this.broadcast(data);
    }

    /**
     * Send next turn update (moderator only)
     */
    sendNextTurn(currentPlayerIndex, currentPlayerId) {
        if (!this.isModerator) return;

        this.broadcast({
            type: 'nextTurn',
            currentPlayerIndex: currentPlayerIndex,
            currentPlayerId: currentPlayerId
        });
    }

    /**
     * Send game over (moderator only)
     */
    sendGameOver(result) {
        if (!this.isModerator) return;

        this.broadcast({
            type: 'gameOver',
            result: result
        });
    }

    /**
     * Generate room code from peer ID
     */
    generateRoomCode(peerId) {
        // Use full peer ID as room code (simplest and most reliable)
        // This ensures cross-device compatibility without needing a backend
        return peerId;
    }

    /**
     * Extract peer ID from room code
     */
    extractPeerIdFromRoomCode(roomCode) {
        // Room code IS the peer ID
        // Just validate it's not empty
        if (!roomCode || roomCode.trim() === '') {
            throw new Error('Invalid room code');
        }

        return roomCode.trim();
    }

    /**
     * Get shareable connection string (includes full peer ID)
     */
    getShareableCode() {
        if (!this.localPlayerId) return null;

        // Return full peer ID as shareable code
        return this.localPlayerId;
    }

    /**
     * Get connection count
     */
    getConnectionCount() {
        return this.connections.size;
    }

    /**
     * Check if connected
     */
    isConnected() {
        return this.peer && !this.peer.disconnected;
    }

    /**
     * Register event handler
     */
    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }

    /**
     * Emit event
     */
    emit(event, data) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach(handler => handler(data));
        }
    }

    /**
     * Disconnect and cleanup
     */
    disconnect() {
        // Close all connections
        this.connections.forEach((conn) => {
            conn.close();
        });
        this.connections.clear();

        // Destroy peer
        if (this.peer) {
            this.peer.destroy();
        }

        this.isInitialized = false;
    }
}
