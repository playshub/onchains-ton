import { Address } from '@ton/core';

console.log(
  [
    {
      name: 'AAO',
      address: 'EQDUE6sTN0Pg7Vtqos90nyrfO_9iVTUUYurnroEARSeo2pBg',
    },
    {
      name: 'Catizen',
      address: 'UQBj96aEiJlFV4Si16ajonjQRHf_OOb-80WXTOOUTHxd8h0a',
    },
    {
      name: 'Major',
      address: 'UQBZ1Lzyfx81Vph2EL2jsQk9pzqo3SC5wit6OyS23ZrUO_xH',
    },
    {
      name: 'CattonAI',
      address: 'kQAPP3aEmdcOEUKAfCxceJScEJHA3K85RQXF3qxUo2XBCKqH',
    },
    {
      name: 'Chickcoop',
      address: 'kQAOsRZKTrMe8ZTtwxxrAC8P84zgmYMF5YML0_NpL0jDrC_g',
    },
    {
      name: 'Cat Gold Minner',
      address: 'kQBg_0I3h4L7f1ca_tY30VUTEilVS0d6QAx8IcwGjIjLZYlh',
    },
  ].map(({ name, address }) => {
    return { name, address: Address.parse(address).toString() };
  }),
);
