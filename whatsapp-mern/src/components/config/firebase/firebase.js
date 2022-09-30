
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBVRNPCGSUslRhSbg5iWRkLrE6E0ZPvTRA",
    authDomain: "whatsapp-mern-wa1011.firebaseapp.com",
    projectId: "whatsapp-mern-wa1011",
    storageBucket: "whatsapp-mern-wa1011.appspot.com",
    messagingSenderId: "706701507995",
    appId: "1:706701507995:web:fa1eef0f524bd6a9b8f53e"
  };

  const firebaseApp=firebase.initializeApp(firebaseConfig)
  const db=firebaseApp.firestore()
  const auth=firebase.auth()
  //const auth=firebase.getAuth()
  const provider=new firebase.auth.GoogleAuthProvider()
   //export default firebase.initializeApp(firebaseConfig)
  export {auth,provider}
  export default db
