import Booking from '../../../shared/models/Booking';
import Class from '../../../shared/models/Class';
import { NotFoundError, BadRequestError } from '../../../shared/utils/errors';

export class BookingService {
  async createBooking(data: any) {
    const { userId, classId, bookingDate } = data;

    // Verificar que la clase existe
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new NotFoundError('Clase no encontrada');
    }

    // Verificar capacidad disponible
    const existingBookings = await Booking.countDocuments({
      classId,
      bookingDate,
      status: { $in: ['confirmed', 'completed'] },
    });

    if (existingBookings >= classData.capacity) {
      throw new BadRequestError('La clase está llena');
    }

    // Crear reserva
    const booking = await Booking.create({
      userId,
      classId,
      bookingDate,
      status: 'confirmed',
      notes: data.notes || '',
    });

    await booking.populate([
      { path: 'userId', select: 'firstName lastName email' },
      { path: 'classId', select: 'name trainerId schedule' },
    ]);

    return booking;
  }

  async getBookingById(bookingId: string) {
    const booking = await Booking.findById(bookingId)
      .populate('userId', 'firstName lastName email')
      .populate('classId', 'name trainerId schedule capacity');

    if (!booking) {
      throw new NotFoundError('Reserva no encontrada');
    }

    return booking;
  }

  async getUserBookings(userId: string) {
    const bookings = await Booking.find({ userId })
      .populate('classId', 'name trainerId schedule')
      .sort({ bookingDate: -1 });

    return bookings;
  }

  async getClassBookings(classId: string) {
    const bookings = await Booking.find({ classId })
      .populate('userId', 'firstName lastName email phone')
      .sort({ bookingDate: 1 });

    return bookings;
  }

  async cancelBooking(bookingId: string) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new NotFoundError('Reserva no encontrada');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestError('La reserva ya está cancelada');
    }

    booking.status = 'cancelled';
    await booking.save();

    await booking.populate([
      { path: 'userId', select: 'firstName lastName email' },
      { path: 'classId', select: 'name trainerId schedule' },
    ]);

    return booking;
  }

  async getUpcomingBookings(userId: string) {
    const now = new Date();
    
    const bookings = await Booking.find({
      userId,
      bookingDate: { $gte: now },
      status: 'confirmed',
    })
      .populate('classId', 'name trainerId schedule duration')
      .sort({ bookingDate: 1 });

    return bookings;
  }
}
