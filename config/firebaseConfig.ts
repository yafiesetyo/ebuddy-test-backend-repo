import { FirebaseOptions } from "firebase/app";
import { initializeApp, App, AppOptions } from "firebase-admin/app";
import { initializeFirestore} from "firebase-admin/firestore";
import { getAuth, Auth } from 'firebase-admin/auth'


export interface IFirebase {
  fs() :FirebaseFirestore.Firestore
  auth(): Auth
}

export class FirebaseConfig implements IFirebase {
  app: App

  constructor(opt: AppOptions) {
    this.app = initializeApp(opt)
  }

  auth(): Auth {
    const auth = getAuth(this.app)
    return auth
  }

  fs(): FirebaseFirestore.Firestore  {
    const fs = initializeFirestore(this.app)
    return fs
  }
}
