import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth as getFirebaseAuth, Auth } from "firebase/auth";

let app: FirebaseApp;
let auth: Auth;

export function initFirebase() {
    if (getApps().length === 0) {
        const firebaseConfig = {
            apiKey: 'AIzaSyAHOSjitvT_qw-NlZ1ip8uOD3vHSDheCcM', //process.env.FIREBASE_API_KEY,
            authDomain: "lunchhitch.firebaseapp.com",
            projectId: "lunchhitch",
            storageBucket: "lunchhitch.appspot.com",
            messagingSenderId: "947628920966",
            appId: "1:947628920966:web:9c51ce8dc29ed8971fc107",
            measurementId: "G-QHNWEVTCH0"
        };

        app = initializeApp(firebaseConfig);
        auth = getFirebaseAuth(app);
    }
}

export function getAuth() {
    if (!auth) initFirebase();
    return auth;
}


export function getApp() {
    if (!app) initFirebase();
    return app;
}
