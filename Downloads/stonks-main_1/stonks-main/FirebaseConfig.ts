import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABOJbPafG-x-xdOJY5JT17bmIGeEQDmEI",
  authDomain: "stonks-ce7f7.firebaseapp.com",
  projectId: "stonks-ce7f7",
  storageBucket: "stonks-ce7f7.firebasestorage.app",
  messagingSenderId: "550279692495",
  appId: "1:550279692495:web:ed5fb9f6a6d0b956e5b7ba",
  measurementId: "G-M0Y28QD6MW"
};

// Initialize Firebase if it hasn't been initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firebase instances
export const FIREBASE_APP = firebase.app();
export const FIREBASE_AUTH = auth();
export const FIREBASE_DB = firestore();
