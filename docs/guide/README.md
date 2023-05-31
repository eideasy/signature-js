# Guide

## Introduction
eideasy-browser-client is a handy tool that you can use to handle the client side parts of the identification and signing flows when using eID Easy API. 

A typical signing implementation using the eID Easy API and the eideasy-browser-client would look like this:
1. Prepare the files for signing by sending a server side request to the [/prepare-files-for-signing](https://documenter.getpostman.com/view/3869493/Szf6WoG1#74939bae-2c9b-459c-9f0b-8070d2bd32f7) endpoint.
2. /prepare-files-for-signing endpoint returns a docId.
3. [Create a browser client instance](/config-reference/#creating-the-client-for-signing) using the docId.
4. Use any of the eideasy-browser-client's signing modules (e.g. [idCardSignature](/config-reference/#signing-with-an-id-card), [smartIdSignature](/config-reference/#signing-with-smart-id), [mobileIdSignature](/config-reference/#signing-with-mobile-id) etc.) to complete the signing process.
5. eID Easy server sends a POST request containing doc_id and signer_id to your configured "Signature notification URL" when the user has finished signing the document.

## Installation

### NPM

1. Install with npm or Yarn:
<CodeGroup>
   <CodeGroupItem title="YARN" active>

```bash:no-line-numbers
yarn add @eid-easy/eideasy-browser-client
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install @eid-easy/eideasy-browser-client
```

  </CodeGroupItem>
</CodeGroup>

2. Import createClient:

```javascript
import createClient from '@eid-easy/eideasy-browser-client';
```

### CDN

1. Add the script tag:

```html:no-v-pre
<script src="https://cdn.jsdelivr.net/npm/@eid-easy/eideasy-browser-client@{{ $theme.version }}/dist/eideasy-browser-client.js" integrity="{{ $theme.sri }}" crossorigin="anonymous"></script>
```

2. Use the eidEasyBrowserClient object to access createClient:

```javascript
const createClient = window.eidEasyBrowserClient.createClient;
```
