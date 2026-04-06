const GameEvent = {
  CardMastered: 'cardMastered',
  ScoreUpdated: 'scoreUpdated',
  System: 'system',
  OnlineCount: 'onlineCount',
};

class GameNotifier {
  handlers = [];
  onlineCount = 0;

  constructor() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const port = window.location.port;
    this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);

    this.socket.onopen = () => {
      this.receiveEvent({ type: GameEvent.System, value: { msg: 'connected' } });
    };

    this.socket.onclose = () => {
      this.receiveEvent({ type: GameEvent.System, value: { msg: 'disconnected' } });
    };

    this.socket.onmessage = async (msg) => {
      try {
        const text = typeof msg.data === 'string' ? msg.data : await msg.data.text();
        const event = JSON.parse(text);

        if (event.type === GameEvent.OnlineCount) {
          this.onlineCount = event.value;
        }

        this.receiveEvent(event);
      } catch {
        // ignore malformed messages
      }
    };
  }

  broadcastEvent(from, type, value) {
    const event = { from, type, value };
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event));
    }
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.handlers.forEach((handler) => handler(event));
  }
}

const notifier = new GameNotifier();

export { GameEvent, notifier as GameNotifier };
