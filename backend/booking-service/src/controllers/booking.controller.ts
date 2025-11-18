import { Response } from 'express';
import { BookingService } from '../services/booking.service';
import { asyncHandler } from '../../../shared/middleware/errorHandler.middleware';
import { IAuthRequest } from '../../../shared/middleware/auth.middleware';

const bookingService = new BookingService();

export const createBooking = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const bookingData = req.body;
  const booking = await bookingService.createBooking(bookingData);
  res.status(201).json({
    success: true,
    data: booking,
    message: 'Reserva creada exitosamente',
  });
});

export const getBookingById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const booking = await bookingService.getBookingById(id);
  res.status(200).json({
    success: true,
    data: booking,
  });
});

export const getUserBookings = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { userId } = req.params;
  const bookings = await bookingService.getUserBookings(userId);
  res.status(200).json({
    success: true,
    data: bookings,
    count: bookings.length,
  });
});

export const getClassBookings = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { classId } = req.params;
  const bookings = await bookingService.getClassBookings(classId);
  res.status(200).json({
    success: true,
    data: bookings,
    count: bookings.length,
  });
});

export const cancelBooking = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const booking = await bookingService.cancelBooking(id);
  res.status(200).json({
    success: true,
    data: booking,
    message: 'Reserva cancelada exitosamente',
  });
});

export const getUpcomingBookings = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { userId } = req.params;
  const bookings = await bookingService.getUpcomingBookings(userId);
  res.status(200).json({
    success: true,
    data: bookings,
    count: bookings.length,
  });
});
