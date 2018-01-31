// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyD9Bw7NPGQSVV947Y-OypRGEsv554E3B7s',
    authDomain: 'prototype-um.firebaseapp.com',
    databaseURL: 'https://prototype-um.firebaseio.com',
    projectId: 'prototype-um',
    storageBucket: 'prototype-um.appspot.com',
    messagingSenderId: '885874681442'
  }
};
