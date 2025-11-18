import { Response } from 'express';
import { MembershipService } from '../services/membership.service';
import { asyncHandler } from '../../../shared/middleware/errorHandler.middleware';
import { IAuthRequest } from '../../../shared/middleware/auth.middleware';

const membershipService = new MembershipService();

export const getPlans = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const plans = membershipService.getAvailablePlans();
  res.status(200).json({
    success: true,
    data: plans,
  });
});

export const createMembership = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const membershipData = req.body;
  const membership = await membershipService.createMembership(membershipData);
  res.status(201).json({
    success: true,
    data: membership,
    message: 'Membresía creada exitosamente',
  });
});

export const getMembershipById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const membership = await membershipService.getMembershipById(id);
  res.status(200).json({
    success: true,
    data: membership,
  });
});

export const getUserMemberships = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { userId } = req.params;
  const memberships = await membershipService.getUserMemberships(userId);
  res.status(200).json({
    success: true,
    data: memberships,
    count: memberships.length,
  });
});

export const renewMembership = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const { months } = req.body;
  const membership = await membershipService.renewMembership(id, months);
  res.status(200).json({
    success: true,
    data: membership,
    message: 'Membresía renovada exitosamente',
  });
});

export const cancelMembership = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const membership = await membershipService.cancelMembership(id);
  res.status(200).json({
    success: true,
    data: membership,
    message: 'Membresía cancelada exitosamente',
  });
});

export const getMembershipStatus = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const status = await membershipService.getMembershipStatus(id);
  res.status(200).json({
    success: true,
    data: status,
  });
});
