import Ride from '../models/Ride.js';

// @desc    Get all rides
// @route   GET /api/rides
// @access  Protected
export const getRides = async (req, res) => {
    try {
        const rides = await Ride.find({}).populate('driver', 'name');
        res.json(rides);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Create a ride
// @route   POST /api/rides
// @access  Protected
export const createRide = async (req, res) => {
    const { from, to, date, time, vehicle, seats, price } = req.body;

    try {
        const ride = await Ride.create({
            from,
            to,
            date,
            time,
            vehicle,
            seats,
            price,
            driver: req.user._id
        });
        res.status(201).json(ride);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Join a ride
// @route   POST /api/rides/:id/join
// @access  Protected
export const joinRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (ride) {
            if (ride.seats <= 0) {
                return res.status(400).json({ message: "No seats available" });
            }
            if (ride.passengers.includes(req.user._id)) {
                return res.status(400).json({ message: "Already joined" });
            }
            ride.passengers.push(req.user._id);
            ride.seats -= 1;
            await ride.save();
            res.json(ride);
        } else {
            res.status(404);
            throw new Error('Ride not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
