import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const bookings = await Booking.find({}).sort({ date: 1, timeSlot: 1 });
        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch bookings' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await dbConnect();

        // Simple verification (could use Zod here too for extra safety)
        if (!body.name || !body.phone || !body.date || !body.timeSlot) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const booking = await Booking.create(body);
        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
    }
}
