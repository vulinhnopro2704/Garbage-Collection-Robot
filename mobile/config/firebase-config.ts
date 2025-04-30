// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";

// // Lấy config từ biến môi trường
// const firebaseConfig = {
// 	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
// 	authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
// 	databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
// 	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
// 	storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
// 	messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
// 	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
// 	measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// // Kiểm tra xem các biến môi trường đã được thiết lập chưa
// if (!firebaseConfig.apiKey) {
// 	throw new Error("Missing Firebase API Key in environment variables");
// }
// if (!firebaseConfig.authDomain) {
// 	throw new Error("Missing Firebase Auth Domain in environment variables");
// }
// if (!firebaseConfig.databaseURL) {
// 	throw new Error("Missing Firebase Database URL in environment variables");
// }
// if (!firebaseConfig.projectId) {
// 	throw new Error("Missing Firebase Project ID in environment variables");
// }
// if (!firebaseConfig.storageBucket) {
// 	throw new Error("Missing Firebase Storage Bucket in environment variables");
// }
// if (!firebaseConfig.messagingSenderId) {
// 	throw new Error(
// 		"Missing Firebase Messaging Sender ID in environment variables"
// 	);
// }
// if (!firebaseConfig.appId) {
// 	throw new Error("Missing Firebase App ID in environment variables");
// }
// if (!firebaseConfig.measurementId) {
// 	throw new Error("Missing Firebase Measurement ID in environment variables");
// }
// console.log("Firebase config loaded", firebaseConfig); // For debugging purposes
// const app = initializeApp(firebaseConfig);
// console.log("Firebase app initialized", app.name); // For debugging purposes
// export const analytics = getAnalytics(app);
// export const auth = getAuth(app);
