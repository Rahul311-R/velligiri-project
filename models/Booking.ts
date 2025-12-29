import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
    name: string;
    phone: string;
    persons: number;
    date: Date;
    timeSlot: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    createdAt: Date;
}

const BookingSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    persons: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
});

// Prevent model recompilation error in development
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
