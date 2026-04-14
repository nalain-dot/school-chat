import mongoose from 'mongoose';

const rideSchema = mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    vehicle: { type: String, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);
export default Ride;
