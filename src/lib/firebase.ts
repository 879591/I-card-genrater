import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

export { signInWithPopup, signOut, onAuthStateChanged, type User };
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  query,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CardData } from '../types/card';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Optional connection test as per skill instructions
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase offline mode active.');
    }
  }
}

// Cloud Card Operations for Authenticated Users
export async function saveCardToFirestore(userId: string, card: CardData): Promise<void> {
  const path = `users/${userId}/cards`;
  try {
    const cardRef = doc(db, path, card.id);
    await setDoc(cardRef, {
      ...card,
      updatedAt: Date.now(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getCardsFromFirestore(userId: string): Promise<CardData[]> {
  const path = `users/${userId}/cards`;
  try {
    const snap = await getDocs(collection(db, path));
    const cards: CardData[] = [];
    snap.forEach((d) => {
      cards.push(d.data() as CardData);
    });
    cards.sort((a, b) => b.updatedAt - a.updatedAt);
    return cards;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function deleteCardFromFirestore(userId: string, cardId: string): Promise<void> {
  const path = `users/${userId}/cards/${cardId}`;
  try {
    await deleteDoc(doc(db, `users/${userId}/cards`, cardId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
