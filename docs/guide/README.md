# Guide

## Introduction
signature-js is a handy library that you can use to handle the browser-side parts of the signing flows when using eID Easy API.

A typical signing implementation using the eID Easy API and the signature-js would look like this:
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
yarn add @eid-easy/signature-js
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash:no-line-numbers
npm install @eid-easy/signature-js
```

  </CodeGroupItem>
</CodeGroup>

2. Import Signature:

```javascript
import Signature from '@eid-easy/signature-js';
```
