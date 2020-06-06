export const SET_OPTION = 'SET_OPTION';

const cityNames = [
  'Arthurs Rest',
  'Black Market',
  'Bridgewatch',
  'Caerleon',
  'Forest Cross',
  'Fort Sterling',
  'Lymhurst',
  'Martlock',
  'Morganas Rest',
  'Thetford'
];

export const cities = cityNames.map((c:string) => ({
  name: c,
  key: `city_${ c.toLowerCase().replace(' ', '_') }`
}));

export function setOption(key:string, value:string) {
  return {
    type: SET_OPTION,
    payload: {
      key,
      value
    }
  }
}
