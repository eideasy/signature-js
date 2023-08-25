class Logger {
  enabled: boolean = false;

  instanceId: string = '';

  constructor({
    enabled = false,
    instanceId = '',
  }: {
    instanceId?: string,
    enabled?: boolean,
  }) {
    this.enabled = enabled;
    this.instanceId = instanceId;
  }

  info(...args: any[]) {
    this.log('info', args);
  }

  error(...args: any[]) {
    this.log('error', args);
  }

  log(type: string, args: any[]) {
    if (!this.enabled) {
      return;
    }

    const finalArgs = [`[${this.instanceId}]: `, ...args];

    if (type === 'error') {
      console.error(...finalArgs);
    } else {
      console.log(...finalArgs);
    }
  }
}

export default Logger;
