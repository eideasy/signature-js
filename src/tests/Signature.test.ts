import Signature from '../Signature';

const dataSets = [
  {
    set: 0,
    baseUrl: 'https://eideasy.eu',
    args: {
      clientId: '09812754jf0asyfahpsfuyasyrasfahsd',
      docId: '73hxvnklatsd83hlasf',
      actionType: 'some-signature-action-type',
      country: 'EE',
      windowTarget: 'dataset-0-window-target',
    },
    result: 'https://eideasy.eu/single-method-signature?client_id=09812754jf0asyfahpsfuyasyrasfahsd&doc_id=73hxvnklatsd83hlasf&method=some-signature-action-type&country=EE&window_target=dataset-0-window-target',
  },
  {
    set: 1,
    baseUrl: 'https://eideasy.eu',
    args: {
      language: 'en',
      clientId: 'poiaudfpuouayh298hdaps',
      docId: '73hxvnk3jdllasp8398lahsdf',
      actionType: 'some-signature-action-type',
      country: 'FI',
      windowTarget: 'dataset-1-window-target',
    },
    result: 'https://eideasy.eu/single-method-signature?client_id=poiaudfpuouayh298hdaps&doc_id=73hxvnk3jdllasp8398lahsdf&method=some-signature-action-type&country=FI&window_target=dataset-1-window-target&lang=en',
  },
  {
    set: 2,
    baseUrl: 'https://eideasy.eu',
    args: {
      language: 'et',
      clientId: 'poiaudfpuouayh298hdaps',
      docId: '73hxvnk3jdllasp8398lahsdf',
      actionType: 'some-signature-action-type',
      country: 'FI',
      windowTarget: 'dataset-2-window-target',
      inputValues: {
        email: 'dummy@dummy.it',
        username: 'dummyuser',
        phone: '+37212345678',
        idcode: '987654321',
      },
    },
    result: 'https://eideasy.eu/single-method-signature?client_id=poiaudfpuouayh298hdaps&doc_id=73hxvnk3jdllasp8398lahsdf&method=some-signature-action-type&country=FI&window_target=dataset-2-window-target&lang=et&email=dummy@dummy.it&username=dummyuser&phone=+37212345678&idcode=987654321',
  },
];

describe.each(dataSets)('Signature should open the window at the correct url for dataset:', (dataSet) => {
  it(`dataset ${dataSet.set}`, () => {
    const signature = new Signature({
      baseUrl: dataSet.baseUrl,
    });
    expect(signature.getSingleMethodSignaturePageUrl(dataSet.args)).toEqual(dataSet.result);
  });
});
