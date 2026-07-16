import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connection';
import { Message } from '@/models/Message';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const userId = session.user.id;

    if (partnerId) {
      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      })
        .sort({ createdAt: 1 })
        .populate('senderId', 'name email image')
        .populate('receiverId', 'name email image')
        .lean();

      await Message.updateMany(
        { receiverId: userId, senderId: partnerId, read: false },
        { $set: { read: true } }
      );

      return NextResponse.json(messages);
    }

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name email image')
      .populate('receiverId', 'name email image')
      .lean();

    const convMap = new Map<string, any>();
    for (const msg of messages) {
      const partnerId = (msg as any).senderId === userId ? (msg as any).receiverId : (msg as any).senderId;
      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, {
          partnerId,
          partner: (msg as any).senderId === userId ? (msg as any).receiverId : (msg as any).senderId,
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
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();
    
    const message = await Message.create({
      ...data,
      senderId: session.user.id,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
