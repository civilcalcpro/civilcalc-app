import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBlQs_KK5uuob2zFjeIp4kS4ajutWAOZbw",
  authDomain: "civilcalc-8a060.firebaseapp.com",
  projectId: "civilcalc-8a060",
  storageBucket: "civilcalc-8a060.firebasestorage.app",
  messagingSenderId: "719184750009",
  appId: "1:719184750009:web:91004a0d17a2d8e145c268",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export { app }
