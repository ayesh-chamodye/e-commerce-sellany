import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuWpBXg9o0VCst7mADZowKro5T3pt47CA",
  authDomain: "sellany-502609.firebaseapp.com",
  databaseURL: "https://sellany-502609-default-rtdb.firebaseio.com",
  projectId: "sellany-502609",
  storageBucket: "sellany-502609.firebasestorage.app",
  messagingSenderId: "1098367987126",
  appId: "1:1098367987126:web:d2c460be73f42c139fa517",
  measurementId: "G-6XDPLV39JN"
};

let app: FirebaseApp;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}

const mockConversations = [
  {
    id: 'conv-1',
    participants: ['mock-user-1', 'mock-seller-1'],
    lastMessage: 'Is this still available?',
    updatedAt: new Date(),
  },
  {
    id: 'conv-2',
    participants: ['mock-user-1', 'mock-seller-3'],
    lastMessage: 'Can you offer a discount?',
    updatedAt: new Date(),
  },
];

const mockMessages = [
  {
    conversationId: 'conv-1',
    senderId: 'mock-user-1',
    receiverId: 'mock-seller-1',
    text: 'Hi, is this still available?',
    createdAt: new Date(),
  },
  {
    conversationId: 'conv-1',
    senderId: 'mock-seller-1',
    receiverId: 'mock-user-1',
    text: 'Yes, it is still available!',
    createdAt: new Date(),
  },
  {
    conversationId: 'conv-2',
    senderId: 'mock-user-1',
    receiverId: 'mock-seller-3',
    text: 'Can you offer a discount?',
    createdAt: new Date(),
  },
];

async function seedMessages() {
  console.log('Starting to seed messages...');

  for (const conversation of mockConversations) {
    try {
      await addDoc(collection(db, 'conversations'), {
        ...conversation,
        updatedAt: serverTimestamp(),
      });
      console.log(`Created conversation: ${conversation.id}`);
    } catch (error) {
      console.error(`Error creating conversation "${conversation.id}":`, error);
    }
  }

  for (const message of mockMessages) {
    try {
      await addDoc(collection(db, 'messages'), {
        ...message,
        createdAt: serverTimestamp(),
      });
      console.log(`Created message for conversation: ${message.conversationId}`);
    } catch (error) {
      console.error(`Error creating message:`, error);
    }
  }

  console.log('Seeding completed!');
  process.exit(0);
}

seedMessages();
