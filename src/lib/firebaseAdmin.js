import admin from 'firebase-admin';
import dotenv from 'dotenv';


dotenv.config();


if(!admin.apps.length) {
    admin.initializeApp({
        credential:admin.credential.cert(JSON.parse(process.env))
    })
}