// utils/socket/socket.js
const { Server } = require('socket.io');
const redisAdapter = require('socket.io-redis');

let io = null;
const connectedClients = {
    player: {}, // { playerId: socket }
    admin: {}, // { adminId: socket }
};
function getReadableSocketInfo(socket) {
    return {
        id: socket.id,
        connected: socket.connected,
        namespace: socket.nsp.name,
        remoteAddress: socket.handshake.address,
        forwardedFor: socket.handshake.headers['x-forwarded-for'],
        origin: socket.handshake.headers.origin,
        referer: socket.handshake.headers.referer,
        time: socket.handshake.time,
        query: socket.handshake.query,
        events: Object.keys(socket._events),
        data: socket.data,
    };
}
function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });

    io.adapter(redisAdapter({ host: process.env.REDIS_HOST || "127.0.0.1", port: process.env.REDIS_PORT || 6379 }));

    io.on('connection', (socket) => {
        socket.on('ping', () => {
            socket.emit('pong');
        });

        socket.on('register', ({ role, userId }) => {
            socket.role = role;
            socket.userId = userId;

            if (role === 'player') {
                connectedClients.player[userId] = socket;
            } else if (role === 'admin') {
                connectedClients.admin[userId] = socket;
            }

            console.log(`${role} connected: ${userId}`);
        });

        // connectedUsers.add(socket.id);
        console.log('Socket connected:', socket.id);

        socket.on('student_warning', (warningData) => {
            console.log({ date: new Date().toUTCString, warningData })
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
}

function getSocketInstance() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = {
    initializeSocket,
    getSocketInstance,
    getReadableSocketInfo
};
