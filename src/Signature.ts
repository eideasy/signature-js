import axios from 'axios';
import windowOpen from './windowOpen';
import Logger from './Logger';

class EidEasy {
  baseUrl: string;

  openedWindow: Window;

  onSuccess: Function;

  onFail: Function;

  onPopupWindowClosed: Function;

  messageHandler: EventListenerOrEventListenerObject;

  successCalled = false;

  pollTimeout: number = null;

  windowTarget: string = null;

  logger: Logger = null;

  constructor({
    baseUrl = 'https://id.eideasy.com',
    onSuccess = () => {
    },
    onFail = () => {
    },
    onPopupWindowClosed = () => {
    },
    loggingEnabled = false,
  }: {
    baseUrl?: string,
    onSuccess?: Function,
    onFail?: Function,
    onPopupWindowClosed?: Function,
    loggingEnabled?: boolean,
  }) {
    const instanceId = this.generateInstanceId();
    this.logger = new Logger({ enabled: loggingEnabled, instanceId });
    this.baseUrl = baseUrl;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onPopupWindowClosed = onPopupWindowClosed;
    this.messageHandler = this.handleMessage.bind(this);
    this.windowTarget = instanceId;

    this.logger.info('EidEasy windowTarget', this.windowTarget);

    window.addEventListener('message', this.messageHandler);
  }

  generateInstanceId(length: number = 32): string {
    // eslint-disable-next-line no-bitwise
    return [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
  }

  handleMessage(event: MessageEvent) {
    const { data } = event;

    if (data.sender !== 'EIDEASY_SINGLE_METHOD_SIGNATURE') {
      this.logger.info('Skipping this message because the data.sender is not EIDEASY_SINGLE_METHOD_SIGNATURE, message data: ', data);
      return;
    }

    if (data.windowTarget !== this.windowTarget) {
      this.logger.info('Skipping this message because the windowTarget in message data does not match', {
        messageDataWindowTarget: data.windowTarget,
        thisWindowTarget: this.windowTarget,
      });
      return;
    }

    this.logger.info('EidEasy handleMessage', event);

    if (data.type === 'SUCCESS') {
      this.logger.info('EidEasy triggering handleSuccess on success message.');
      this.handleSuccess();
    } else if (data.type === 'FAIL') {
      this.logger.info('EidEasy triggering handleFail on fail message.');
      this.handleFail(data.error, data.isRetryAllowed);
    }
  }

  start({
    clientId,
    docId,
    actionType,
    country,
  }: {
    clientId: string,
    docId: string,
    actionType: string,
    country: string,
  }) {
    this.successCalled = false;
    const self = this;
    const url: string = this.getSingleMethodSignaturePageUrl({
      clientId,
      docId,
      actionType,
      country,
      windowTarget: this.windowTarget,
    });

    const windowOpenResult = windowOpen({
      target: this.windowTarget,
      url,
      onClosed: () => {
        self.stop();
        self.onPopupWindowClosed();
      },
      logger: this.logger,
    });

    this.openedWindow = windowOpenResult.window;
    if (this.pollTimeout) {
      window.clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }
    this.poll(docId, clientId);
  }

  stop() {
    window.clearTimeout(this.pollTimeout);
    this.pollTimeout = null;
    if (this.openedWindow.close) {
      this.openedWindow.close();
    }
  }

  poll(docId: string, clientId: string) {
    const self = this;
    this.pollTimeout = window.setTimeout(() => {
      axios.post(`${this.baseUrl}/api/signatures/signing-session/status`, {
        doc_id: docId,
        client_id: clientId,
      }).then((response) => {
        if (response.data && response.data.signing_session_status === 'SIGNED') {
          self.logger.info('Calling handleSuccess signing_session_status SIGNED in poller');
          self.handleSuccess();
          return;
        }
        self.poll(docId, clientId);
      }).catch((error) => {
        self.logger.info(error);
      });
    }, 2000);
  }

  handleSuccess() {
    if (this.successCalled) {
      this.logger.info('Success already called');
      return;
    }

    this.successCalled = true;
    try {
      this.openedWindow.close();
    } catch (e) {
      this.logger.error(e);
    }

    this.onSuccess();
  }

  handleFail(error: object, isRetryAllowed: boolean) {
    // End user can still retry the actions in the popup window, so we don't want to close it yet.
    if (isRetryAllowed) {
      return;
    }

    this.openedWindow.close();
    this.onFail(error);
  }

  getSingleMethodSignaturePageUrl({
    clientId,
    docId,
    actionType,
    country,
    windowTarget,
  }: {
    clientId: string,
    docId: string,
    actionType: string,
    country: string,
    windowTarget: string,
  }): string {
    const base = `${this.baseUrl}/single-method-signature`;

    const urlParams = [
      `client_id=${clientId}`,
      `doc_id=${docId}`,
      `method=${actionType}`,
      `country=${country}`,
      `window_target=${windowTarget}`,
    ];

    const queryString = urlParams.join('&');

    return `${base}?${queryString}`;
  }

  destroy() {
    window.removeEventListener('message', this.messageHandler);
    window.clearTimeout(this.pollTimeout);
    this.pollTimeout = null;
  }
}

export default EidEasy;
