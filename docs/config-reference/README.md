# Config Reference

## Identification Config Reference
### Creating the client for identification

```javascript
const eidEasyClient = window.eidEasyBrowserClient.createClient({
    clientId: '2IaeiZXbcKzlP1KvjZH9ghty2IJKM8Lg', // required
    redirectUri: 'http://localhost/', // required
    apiEndpoints: { // required
      identityStart: () => 'https://eid-sample-app.test/api/identity/start',
      identityFinish: () => 'https://eid-sample-app.test/api/identity/finish',
    },
    countryCode: 'EE', // required
    language: 'et',
    sandbox: true,
    oauthParamState: 'custom-state-value', // this gets used only in case of identification methods
});
```

#### Client Settings

Option | Type | Default   | Description
------ | ---- |-----------| -----------
clientId | string | undefined | **Required**. Get from id.eideasy.com after signing up.
redirectUri | string | undefined | **Required**. This gets used for redirects back to your application e.g. when using eParaksts mobile. The value of redirectUri has to match with the "Oauth redirect_uri(s)" setting you provided in your eID Easy admin page.
apiEndpoints.identityStart | function | undefined | **Required**. This should return your server endpoint for the identity start request.
apiEndpoints.identityFinish | function | undefined | **Required**. This should return your server endpoint for the identity finish request.
countryCode | string | undefined | **Required**. [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code
sandbox | boolean | false     | Whether to use the [sandbox](https://eideasy.com/developer-documentation/sandbox/) mode.
language | string | 'en'      | Two letter [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code.
oauthParamState | string | undefined | Value of the OAuth `state` param.

### Identification with an ID Card

```javascript
eidEasyClient.identification.idCard.start({
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
      // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### idCard identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
fail | function | undefined | This function gets called when the authentication process failed.
success | function | undefined | This function gets called when the authentication process succeeds.
finished | function | undefined | This function gets called when the authentication process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.

### Identification with Smart-ID

```javascript
eidEasyClient.identification.smartId.start({
   idcode: '10101010005', // required
   started: (result) => {
      // do something with the result
      // e.g. display the result.data.challenge code
   },
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
      // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### smartId identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
idcode | string | undefined | **Required**. End user's personal identification code
started | function | undefined | This function gets called when the authentication process has started. The argument object of this function contains the challenge (response.data.challenge) you can display to the end-user.
fail | function | undefined | This function gets called when the authentication process failed.
success | function | undefined | This function gets called when the authentication process succeeds.
finished | function | undefined | This function gets called when the authentication process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.

### Identification with Mobile ID

```javascript
eidEasyClient.identification.mobileId.start({
   idcode: '60001019906', // required
   phone: '+37200000766', // required
   started: (result) => {
      // do something with the result
      // e.g. display the result.data.challenge code
   },
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
      // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### mobileId identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
idcode | string | undefined | **Required**. End user's personal identification code
phone | string | undefined | **Required**. End user's phone number, must have the [country code](https://countrycode.org/) prefixed with a '+' sign, e.g. +37200000766
started | function | undefined | This function gets called when the authentication process has started. The argument object of this function contains the challenge (response.data.challenge) you can display to the end-user.
fail | function | undefined | This function gets called when the authentication process failed.
success | function | undefined | This function gets called when the authentication process succeeds.
finished | function | undefined | This function gets called when the authentication process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.

### Identification with eParaksts mobile
eParaksts Mobile is an OAuth2 based method, so:
1) user gets redirected to the eParaksts page where they have to enter their user number
2) eParaksts then asks the user for confirmation on their cellphone
3) user gets redirected back to the redirectUri specified in the eidEasyClient settings with a token you can use to fetch data

```javascript
eidEasyClient.identification.eParakstsMobile.start({
   redirect: (context) => {
      console.log(context);
      // you can do the redirect here yourself should you wish so
      // window.location.href = context.redirectUrl;
      return {
         data: null,
      };
   },
});
```

#### eParakstsMobile identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
redirect | function | undefined | You can use this setting to override the default redirection functionality

### Identification with Freja eID

```javascript
eidEasyClient.identification.frejaEid.start({
   idcode: 'xxxxxxxxxxxxx', // required
   started: () => {
      // identification process has started,
      // Freja eID app will prompt the user to approve the identification request
   },
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
     // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### Freja eID identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
idcode | string | undefined | **Required**. End user's personal identification code
started | function | undefined | This function gets called when the authentication process has started, Freja eID app will prompt the user to approve the identification request.
fail | function | undefined | This function gets called when the authentication process failed.
success | function | undefined | This function gets called when the authentication process succeeds.
finished | function | undefined | This function gets called when the authentication process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.

### Identification with ZealiD
When the ZealiD identification process starts, eidEasyClient will automatically create a ZealId iframe
and start listening for messages originating from that iframe.
You just have to provide a DOM element (the "iframeHolder" setting in the example below) to which eidEasyClient can append the iframe.

```javascript
eidEasyClient.identification.zealId.start({
   iframeHolder: document.getElementById('zealIdIframeHolder'), // Required. DOM element whose content gets replaced with the ZealiD's iframe
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
     // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### ZealiD identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
iframeHolder | DOM element | undefined | **Required**. DOM element whose content gets replaced with the ZealiD's iframe
fail | function | undefined | This function gets called when the authentication process failed.
success | function | undefined | This function gets called when the authentication process succeeds.
finished | function | undefined | This function gets called when the authentication process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.


### Identification with Austrian Handy Signatur
Austrian Handy Signatur is a redirect based method, so:
1) user gets redirected to the Austrian Handy Signatur page where they have to enter their user and mobile number
2) Austrian Handy Signatur then asks the user for confirmation on their cellphone
3) user gets redirected back to the redirectUri specified in the eidEasyClient settings with a token you can use to fetch data

```javascript
eidEasyClient.identification.atHandy.start({
   redirect: (context) => {
      console.log(context);
      // you can do the redirect here yourself should you wish so
      // window.location.href = context.redirectUrl;
      return {
         data: null,
      };
   },
});
```

#### Austrian Handy Signatur identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
redirect | function | undefined | You can use this setting to override the default redirection functionality


## Signing Config Reference
### Creating the client for signing

```javascript
const eidEasyClient = window.eidEasyBrowserClient.createClient({
   clientId: '2IaeiZXbcKzlP1KvjZH9ghty2IJKM8Lg', // required
   docId: 'CR1GsqrBICJmJMXTCxM82jxb8MlhLpWTacZARn4o', // required
   countryCode: 'EE', // required
   language: 'et',
   sandbox: true,
});
```

#### Client Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
clientId | string | undefined | **Required**. Get from id.eideasy.com after signing up.
docId | string | undefined | **Required**. The docId of the document you have prepared for signing. You can find more information on file preparation [here](https://eideasy.com/developer-documentation/esignature-saas/file-preparation/) and the API reference for file preparation [here](https://documenter.getpostman.com/view/3869493/Szf6WoG1#74939bae-2c9b-459c-9f0b-8070d2bd32f7)
countryCode | string | undefined | **Required**. [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code
sandbox | boolean | false | Whether to use the [sandbox](https://eideasy.com/developer-documentation/sandbox/) mode.
language | string | 'en' | Two letter [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code.

### Signing with an ID Card

```javascript
eidEasyClient.signature.idCardSignature.start({
   countryCode: 'EE',
   iframeHolder: document.getElementById('idCardIframeHolder'), // Required. DOM element whose content gets replaced with an iframe (this iframe will be used to get the signing certificates from the id card)
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
      // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### idCard signing settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
countryCode | string | undefined | **Required**. [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code of the country that issued the id card
iframeHolder | DOM element | undefined | **Required**. DOM element whose content gets replaced with an iframe (this iframe will be used to get the signing certificates from the id card)
fail | function | undefined | This function gets called when the signing process failed.
success | function | undefined | This function gets called when the signing process succeeds.
finished | function | undefined | This function gets called when the signing process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.

### Signing with Smart-ID

```javascript
eidEasyClient.signature.smartIdSignature.start({
   idcode: '10101010005', // required
   ccountryCode: 'EE', // required
   started: (result) => {
      // do something with the result
      // e.g. display the result.data.challenge code
   },
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
      // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### smartId identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
idcode | string | undefined | **Required**. End user's personal identification code
countryCode | string | undefined | **Required**. [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code of the country where the user has registered their Smart-ID account
started | function | undefined | This function gets called when the signing process has started. The argument object of this function contains the security challenge code (response.data.challenge) that the end user sees on their device. You should display this code in your app so that the user can be sure that they are signing the right document.
fail | function | undefined | This function gets called when the signing process failed.
success | function | undefined | This function gets called when the signing process succeeds.
finished | function | undefined | This function gets called when the signing process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.

### Signing with Mobile ID

```javascript
eidEasyClient.signature.mobileIdSignature.start({
   idcode: '60001019906', // required
   phone: '+37200000766', // required
   ccountryCode: 'EE', // required
   started: (result) => {
      // do something with the result
      // e.g. display the result.data.challenge code
   },
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
      // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### mobileId identification settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
idcode | string | undefined | **Required**. End user's personal identification code
phone | string | undefined | **Required**. End user's phone number, must have the [country code](https://countrycode.org/) prefixed with a '+' sign, e.g. +37200000766
countryCode | string | undefined | **Required**. [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code of the country where the user has registered their Mobile ID account
started | function | undefined | This function gets called when the signing process has started. The argument object of this function contains the security challenge code (response.data.challenge) that the end user sees on their device. You should display this code in your app so that the user can be sure that they are signing the right document.
fail | function | undefined | This function gets called when the signing process failed.
success | function | undefined | This function gets called when the signing process succeeds.
finished | function | undefined | This function gets called when the signing process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.

### Signing with eParaksts mobile
eParaksts Mobile is an OAuth2 based method, so the user gets redirected to the eParaksts page where they can complete the signing process.

```javascript
eidEasyClient.signature.eParakstsMobileSignature.start({
   redirect: (context) => {
      console.log(context);
      // you can do the redirect here yourself should you wish so
      // window.location.href = context.redirectUrl;
      return {
         data: null,
      };
   },
});
```

#### eParakstsMobile signing settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
redirect | function | undefined | You can use this setting to override the default redirection functionality

### Signing with ZealiD
ZealId signing is a redirect based method, so the user gets redirected to the Zeal ID view where they can use their smartphone to complete the signing process.

```javascript
eidEasyClient.signature.zealIdSignature.start({
   ccountryCode: 'EE', // required
   redirect: (context) => {
      console.log(context);
      // you can do the redirect here yourself should you wish so
      // window.location.href = context.redirectUrl;
      return {
         data: null,
      };
   },
});
```

#### ZealiD signing settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
countryCode | string | undefined | **Required**. [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code of the country where the user has registered their Zeal-ID account
redirect | function | undefined | You can use this setting to override the default redirection functionality


### Signing with Austrian Handy Signatur
Austrian Handy Signatur is a redirect based method, so the user gets redirected to the Austrian Handy Signatur page where they will complete the signing process.

```javascript
eidEasyClient.signature.atHandySignature.start({
   redirect: (context) => {
      console.log(context);
      // you can do the redirect here yourself should you wish so
      // window.location.href = context.redirectUrl;
      return {
         data: null,
      };
   },
});
```

#### Austrian Handy Signatur signing settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
redirect | function | undefined | You can use this setting to override the default redirection functionality


### Signing with Finnish Banks and Mobile ID
This is done through a redirect, so the user gets redirected to a view where they will see all the buttons for all the available Finnish Banks and the Mobile ID button.
They then choose their preferred method and complete the signing process.

```javascript
eidEasyClient.signature.ftnSignature.start({
   redirect: (context) => {
      console.log(context);
      // you can do the redirect here yourself should you wish so
      // window.location.href = context.redirectUrl;
      return {
         data: null,
      };
   },
});
```

#### Austrian Handy Signatur signing settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
redirect | function | undefined | You can use this setting to override the default redirection functionality

### Signing with One Time Password (OTP)
With OTP, eID Easy will send the user either an email or sms (depending on with which parameters you initiate the flow) that contains a one time password.
You then ask the user to enter that OTP in your application and then provide it to the otpSignature module.

```javascript
eidEasyClient.signature.otpSignature.start({
   smsToken: '123455',
   emailToken: '873nf7ssorwdm8e',
   fail: (error) => {
      // do something with the error
   },
   success: (result) => {
      // do something with the result
   },
   finished: () => {
      // the process has finished, you can do some clean up like hiding a loader here
   },
});
```

#### Austrian Handy Signatur signing settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
smsToken | string | undefined | The token (OTP) that the user receives via sms.
emailToken | string | undefined | The token (OTP) that the user receives via email.
fail | function | undefined | This function gets called when the signing process failed.
success | function | undefined | This function gets called when the signing process succeeds.
finished | function | undefined | This function gets called when the signing process has either failed or succeeded. This means that this function gets called always, no matter the authentication result. For example, it can be useful to hide a loading spinner at the end of the authentication process or to do some other clean up work.

