import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/serverAuth';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  setDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getDocument } from '@/lib/firebase/firestore';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyFirebaseToken(authHeader.split('Bearer ')[1]);
    const userId = payload.sub;

    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');

    if (partnerId) {
      const q = query(
        collection(db, 'messages'),
        where('senderId', 'in', [userId, partnerId]),
        orderBy('createdAt', 'asc')
      );
      const snap = await getDocs(q);
      let messages = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((m: any) => (m.senderId === userId && m.receiverId === partnerId) || (m.senderId === partnerId && m.receiverId === userId));

      const unreadMessages = messages.filter((m: any) => m.receiverId === userId && !m.read);
      for (const msg of unreadMessages) {
        await updateDoc(doc(db, 'messages', msg.id), { read: true });
      }

      return NextResponse.json(messages);
    }

    const q = query(collection(db, 'messages'), where('senderId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const sent = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const q2 = query(collection(db, 'messages'), where('receiverId', '==', userId), orderBy('createdAt', 'desc'));
    const snap2 = await getDocs(q2);
    const received = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));

    const allMessages = [...sent, ...received];
    const convMap = new Map<string, any>();
    for (const msg of allMessages) {
      const partner = (msg as any).senderId === userId ? (msg as any).receiverId : (msg as any).senderId;
      if (!convMap.has(partner)) {
        convMap.set(partner, {
          partnerId: partner,
          partner,
          lastMessage: msg,
        });
      }
    }

    return NextResponse.json(Array.from(convMap.values()));
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyFirebaseToken(authHeader.split('Bearer ')[1]);
    const userId = payload.sub;

    const data = await request.json();

    const messageRef = doc(collection(db, 'messages'));
    const message = {
      ...data,
      senderId: userId,
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(messageRef, message);

    return NextResponse.json({ id: messageRef.id, ...message }, { status: 201 });
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
