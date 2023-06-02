import axios from 'axios';
import windowOpen from './windowOpen';

class EidEasy {
  baseUrl: string;

  openedWindow: Window;

  onSuccess: Function;

  onFail: Function;

  onPopupWindowClosed: Function;

  messageHandler: EventListenerOrEventListenerObject;

  successCalled = false;

  pollTimeout: number = null;

  constructor({
    baseUrl = 'https://id.eaideasy.com',
    onSuccess = () => {
    },
    onFail = () => {
    },
    onPopupWindowClosed = () => {
    },
  }: {
    baseUrl?: string,
    onSuccess?: Function,
    onFail?: Function,
    onPopupWindowClosed?: Function,
  }) {
    this.baseUrl = baseUrl;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onPopupWindowClosed = onPopupWindowClosed;
    this.messageHandler = this.handleMessage.bind(this);

    window.addEventListener('message', this.messageHandler);
  }

  handleMessage(event: MessageEvent) {
    const { data } = event;

    if (data.sender !== 'EIDEASY_SINGLE_METHOD_SIGNATURE') {
      return;
    }

    if (data.type === 'SUCCESS') {
      this.handleSuccess(data.result);
    } else if (data.type === 'FAIL') {
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
    });

    const windowOpenResult = windowOpen({
      url,
      onClosed: self.onPopupWindowClosed,
    });

    this.openedWindow = windowOpenResult.window;
    if (this.pollTimeout) {
      window.clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }
    this.poll(docId, clientId);
  }

  poll(docId: string, clientId: string) {
    console.log('POLL');
    const self = this;
    this.pollTimeout = window.setTimeout(() => {
      axios.post(`${this.baseUrl}/api/signatures/signing-session/status`, {
        doc_id: docId,
        client_id: clientId,
      }).then((response) => {
        if (response.data && response.data.signing_session_status === 'SIGNED') {
          self.handleSuccess(response.data.result);
          return;
        }
        self.poll(docId, clientId);
      }).catch((error) => {
        console.log(error);
      });
    }, 2000);
  }

  handleSuccess(result: object) {
    if (this.successCalled) {
      console.log('Success already called');
      return;
    }

    this.successCalled = true;
    try {
      this.openedWindow.close();
    } catch (e) {
      console.error(e);
    }

    this.onSuccess(result);
  }

  getSingleMethodSignaturePageUrl({
    clientId,
    docId,
    actionType,
    country,
  }: {
    clientId: string,
    docId: string,
    actionType: string,
    country: string,
  }): string {
    const base = `${this.baseUrl}/single-method-signature`;

    const urlParams = [
      `client_id=${clientId}`,
      `doc_id=${docId}`,
      `method=${actionType}`,
      `country=${country}`,
    ];

    const queryString = urlParams.join('&');

    return `${base}?${queryString}`;
  }

  handleFail(error: object, isRetryAllowed: boolean) {
    // End user can still retry the actions in the popup window, so we don't want to close it yet.
    if (isRetryAllowed) {
      return;
    }

    this.openedWindow.close();
    this.onFail(error);
  }

  destroy() {
    window.removeEventListener('message', this.messageHandler);
    window.clearTimeout(this.pollTimeout);
    this.pollTimeout = null;
  }
}

export default EidEasy;
