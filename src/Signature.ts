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

  pollTimeout = null;

  constructor({
    baseUrl = 'https://id.eideasy.com',
    onSuccess = () => {
    },
    onFail = () => {
    },
    onPopupWindowClosed = () => {
    },
  }: {
    baseUrl: string,
    onSuccess: Function,
    onFail: Function,
    onPopupWindowClosed: Function,
  }) {
    this.baseUrl = baseUrl;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onPopupWindowClosed = onPopupWindowClosed;
    this.messageHandler = this.handleMessage.bind(this);

    window.addEventListener('message', this.messageHandler);
  }

  handleMessage(event) {
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
  }) {
    this.successCalled = false;
    const _self = this;
    const url: string = `${this.baseUrl}/single-method-signature?client_id=${clientId}&doc_id=${docId}&method=${actionType}&country=${country}`;
    const windowOpenResult = windowOpen({
      url,
      onClosed: _self.onPopupWindowClosed,
    });

    this.openedWindow = windowOpenResult.window;
    if (this.pollTimeout) {
      window.clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }
    this.poll(docId, clientId);
  }

  poll(docId, clientId) {
    console.log('Start polling');
    const _self = this;
    this.pollTimeout = window.setTimeout(() => {
      axios.post(`${this.baseUrl}/api/signatures/signing-session/status`, {
        doc_id: docId,
        client_id: clientId,
      }).then((response) => {
        if (response.data && response.data.signing_session_status === 'SIGNED') {
          _self.handleSuccess(response.data.result);
          return;
        }
        _self.poll(docId, clientId);
      }).catch((error) => {
        console.log(error);
      });
    }, 2000);
  }

  handleSuccess(result) {
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

  handleFail(error, isRetryAllowed) {
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
