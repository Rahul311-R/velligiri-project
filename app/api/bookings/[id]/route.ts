import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { getSession } from '@/lib/auth';

// Helper to access params (async in Next.js 15)
// But in Next 15 App routers route handlers, params is a Promise or object.
// We should type it carefully. Standard signature is:
// export async function PATCH(request: Request, context: { params: Promise<{ id: string }> })

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        await dbConnect();

        const updatedBooking = await Booking.findByIdAndUpdate(id, body, { new: true });

        if (!updatedBooking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(updatedBooking);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to update booking' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Booking deleted' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete booking' }, { status: 500 });
    }
}
