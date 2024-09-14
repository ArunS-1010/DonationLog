import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDhoRIqKBVtPuBhVyPP6ITAhgXaoJQyUZk',
  authDomain: 'react-otp-work-519d9.firebaseapp.com',
  projectId: 'react-otp-work-519d9',
  storageBucket: 'react-otp-work-519d9.appspot.com',
  messagingSenderId: '771012918005',
  appId: '1:771012918005:web:e163185bed11fdd31323bc',
  measurementId: 'G-Y4FCLCT59C',
}

firebase.initializeApp(firebaseConfig)

export default firebase
