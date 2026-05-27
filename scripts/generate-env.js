const fs = require('fs');

const env = `export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
  },
  razorpayKey: '${process.env.RAZORPAY_KEY}',
};
`;

fs.mkdirSync('./src/environments', { recursive: true });
fs.writeFileSync('./src/environments/environment.ts', env);
console.log('✅ environment.ts generated');