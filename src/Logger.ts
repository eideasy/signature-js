class Logger {
  enabled: boolean = false;

  constructor({ enabled = false }: { enabled?: boolean }) {
    this.enabled = enabled;
  }

  info(...args: any[]) {
    if (!this.enabled) {
      return;
    }
    console.log(...args);
  }

  error(...args: any[]) {
    if (!this.enabled) {
      return;
    }
    console.error(...args);
  }
}

export default Logger;
