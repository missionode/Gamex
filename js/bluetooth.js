/**
 * Bluetooth Manager for Gamex
 * Handles Web Bluetooth API connections between players
 */

class BluetoothManager {
    constructor() {
        this.device = null;
        this.server = null;
        this.service = null;
        this.characteristic = null;
        this.connectedDevices = new Map();
        this.eventHandlers = {};

        // Gamex Bluetooth Service UUID (custom)
        this.SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
        this.CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';
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
     * Check if Web Bluetooth is supported
     */
    isSupported() {
        return navigator.bluetooth !== undefined;
    }

    /**
     * Scan for nearby players
     */
    async scanForPlayers() {
        if (!this.isSupported()) {
            throw new Error('Web Bluetooth is not supported on this browser');
        }

        try {
            // Request Bluetooth device
            const device = await navigator.bluetooth.requestDevice({
                filters: [
                    { services: [this.SERVICE_UUID] }
                ],
                optionalServices: [this.SERVICE_UUID]
            });

            this.device = device;

            // Handle disconnection
            device.addEventListener('gattserverdisconnected', () => {
                this.handleDisconnection(device);
            });

            // Connect to GATT server
            await this.connect(device);

            return device;
        } catch (error) {
            if (error.name === 'NotFoundError') {
                throw new Error('No devices found. Make sure other players have the game open.');
            } else if (error.name === 'SecurityError') {
                throw new Error('Bluetooth access denied. Please grant permission.');
            } else {
                throw new Error('Failed to scan for devices: ' + error.message);
            }
        }
    }

    /**
     * Connect to a device
     */
    async connect(device) {
        try {
            console.log('Connecting to GATT Server...');
            const server = await device.gatt.connect();
            this.server = server;

            console.log('Getting Service...');
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this.service = service;

            console.log('Getting Characteristic...');
            const characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            this.characteristic = characteristic;

            // Start notifications
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                this.handleDataReceived(event.target.value);
            });

            // Store connected device
            this.connectedDevices.set(device.id, {
                device,
                server,
                service,
                characteristic
            });

            // Emit connection event
            this.emit('playerConnected', {
                id: device.id,
                name: device.name || 'Player ' + (this.connectedDevices.size + 1),
                isHost: false,
                isLocal: false
            });

            return true;
        } catch (error) {
            console.error('Connection failed:', error);
            throw new Error('Failed to connect to device: ' + error.message);
        }
    }

    /**
     * Start advertising as host (GATT Server)
     * Note: Web Bluetooth API doesn't support peripheral mode yet
     * This is a placeholder for future implementation or native app version
     */
    async startAdvertising() {
        console.warn('Web Bluetooth API does not support peripheral/server mode yet');
        console.log('Host mode is simulated for now');

        // In production, you would need:
        // 1. Use Web Bluetooth Scanning API (experimental)
        // 2. Or implement with WebRTC for P2P connection
        // 3. Or use a native wrapper (Capacitor/Cordova)

        return true;
    }

    /**
     * Send data to connected devices
     */
    async sendData(data) {
        if (!this.characteristic) {
            throw new Error('Not connected to any device');
        }

        try {
            const encoder = new TextEncoder();
            const dataString = JSON.stringify(data);
            const dataBytes = encoder.encode(dataString);

            await this.characteristic.writeValue(dataBytes);
            return true;
        } catch (error) {
            console.error('Failed to send data:', error);
            throw new Error('Failed to send data: ' + error.message);
        }
    }

    /**
     * Broadcast data to all connected devices
     */
    async broadcastData(data) {
        const promises = [];

        for (const [deviceId, connection] of this.connectedDevices) {
            try {
                const encoder = new TextEncoder();
                const dataString = JSON.stringify(data);
                const dataBytes = encoder.encode(dataString);

                promises.push(connection.characteristic.writeValue(dataBytes));
            } catch (error) {
                console.error(`Failed to send to device ${deviceId}:`, error);
            }
        }

        await Promise.allSettled(promises);
    }

    /**
     * Handle received data
     */
    handleDataReceived(value) {
        try {
            const decoder = new TextDecoder();
            const dataString = decoder.decode(value);
            const data = JSON.parse(dataString);

            console.log('Data received:', data);

            // Emit appropriate event based on data type
            if (data.type === 'choice') {
                this.emit('choiceReceived', data);
            } else if (data.type === 'playerJoined') {
                this.emit('playerConnected', data.player);
            } else if (data.type === 'gameStart') {
                this.emit('gameStarted', data);
            } else if (data.type === 'modeChange') {
                this.emit('modeChanged', data);
            }
        } catch (error) {
            console.error('Failed to parse received data:', error);
        }
    }

    /**
     * Handle device disconnection
     */
    handleDisconnection(device) {
        console.log(`Device disconnected: ${device.name}`);

        this.connectedDevices.delete(device.id);

        this.emit('playerDisconnected', device.id);
    }

    /**
     * Disconnect from all devices
     */
    async disconnect() {
        for (const [deviceId, connection] of this.connectedDevices) {
            if (connection.server && connection.server.connected) {
                connection.server.disconnect();
            }
        }

        this.connectedDevices.clear();
        this.device = null;
        this.server = null;
        this.service = null;
        this.characteristic = null;
    }

    /**
     * Get connected devices count
     */
    getConnectedDevicesCount() {
        return this.connectedDevices.size;
    }

    /**
     * Check if connected
     */
    isConnected() {
        return this.server && this.server.connected;
    }
}

// For alternative P2P connection using WebRTC (future enhancement)
class WebRTCManager {
    constructor() {
        this.connections = new Map();
        this.dataChannels = new Map();
        this.eventHandlers = {};

        // STUN servers for NAT traversal
        this.iceServers = [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ];
    }

    /**
     * Create peer connection
     */
    async createConnection(peerId) {
        const pc = new RTCPeerConnection({
            iceServers: this.iceServers
        });

        // Handle ICE candidates
        pc.addEventListener('icecandidate', (event) => {
            if (event.candidate) {
                this.emit('iceCandidate', {
                    peerId,
                    candidate: event.candidate
                });
            }
        });

        // Handle connection state changes
        pc.addEventListener('connectionstatechange', () => {
            console.log(`Connection state: ${pc.connectionState}`);
            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                this.emit('playerDisconnected', peerId);
            }
        });

        // Create data channel
        const dataChannel = pc.createDataChannel('gamex-data');
        this.setupDataChannel(dataChannel, peerId);

        this.connections.set(peerId, pc);

        return pc;
    }

    /**
     * Setup data channel
     */
    setupDataChannel(channel, peerId) {
        channel.addEventListener('open', () => {
            console.log(`Data channel open with ${peerId}`);
            this.emit('playerConnected', { id: peerId });
        });

        channel.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleDataReceived(data, peerId);
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        });

        channel.addEventListener('close', () => {
            console.log(`Data channel closed with ${peerId}`);
        });

        this.dataChannels.set(peerId, channel);
    }

    /**
     * Send data to specific peer
     */
    sendData(peerId, data) {
        const channel = this.dataChannels.get(peerId);
        if (channel && channel.readyState === 'open') {
            channel.send(JSON.stringify(data));
        }
    }

    /**
     * Broadcast to all peers
     */
    broadcastData(data) {
        for (const [peerId, channel] of this.dataChannels) {
            if (channel.readyState === 'open') {
                channel.send(JSON.stringify(data));
            }
        }
    }

    /**
     * Handle received data
     */
    handleDataReceived(data, peerId) {
        console.log(`Data from ${peerId}:`, data);
        // Emit events similar to BluetoothManager
        this.emit(data.type || 'data', { ...data, peerId });
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
     * Close all connections
     */
    disconnect() {
        for (const [peerId, pc] of this.connections) {
            pc.close();
        }
        this.connections.clear();
        this.dataChannels.clear();
    }
}
