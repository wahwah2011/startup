const { WebSocketServer } = require('ws');

function peerProxy(httpServer) {
  const wss = new WebSocketServer({ server: httpServer });

  let connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: Date.now(), alive: true, ws };
    connections.push(connection);

    broadcastOnlineCount();

    ws.on('message', (data) => {
      connections.forEach((c) => {
        if (c.id !== connection.id && c.ws.readyState === c.ws.OPEN) {
          c.ws.send(data);
        }
      });
    });

    ws.on('close', () => {
      connections = connections.filter((c) => c.id !== connection.id);
      broadcastOnlineCount();
    });

    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  function broadcastOnlineCount() {
    const msg = JSON.stringify({ type: 'onlineCount', value: connections.length });
    connections.forEach((c) => {
      if (c.ws.readyState === c.ws.OPEN) {
        c.ws.send(msg);
      }
    });
  }

  setInterval(() => {
    connections.forEach((c) => {
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000);
}

module.exports = { peerProxy };
