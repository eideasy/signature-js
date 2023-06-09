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
    },
    result: 'https://eideasy.eu/single-method-signature?client_id=09812754jf0asyfahpsfuyasyrasfahsd&doc_id=73hxvnklatsd83hlasf&method=some-signature-action-type&country=EE',
  },
  {
    set: 1,
    baseUrl: 'https://eideasy.eu',
    args: {
      clientId: 'poiaudfpuouayh298hdaps',
      docId: '73hxvnk3jdllasp8398lahsdf',
      actionType: 'some-signature-action-type',
      country: 'FI',
    },
    result: 'https://eideasy.eu/single-method-signature?client_id=poiaudfpuouayh298hdaps&doc_id=73hxvnk3jdllasp8398lahsdf&method=some-signature-action-type&country=FI',
  },
];

describe.each(dataSets)('windowOpen should center the window for:', (dataSet) => {
  it(`dataset ${dataSet.set}`, () => {
    const signature = new Signature({
      baseUrl: dataSet.baseUrl,
    });
    expect(signature.getSingleMethodSignaturePageUrl(dataSet.args)).toEqual(dataSet.result);
  });
});
