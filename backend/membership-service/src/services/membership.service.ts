import Membership from '../../../shared/models/Membership';
import { NotFoundError, BadRequestError } from '../../../shared/utils/errors';

interface MembershipPlan {
  type: 'basic' | 'premium' | 'vip';
  name: string;
  price: number;
  features: string[];
  duration: number; // meses
}

export class MembershipService {
  private plans: MembershipPlan[] = [
    {
      type: 'basic',
      name: 'Plan Básico',
      price: 29.99,
      features: [
        'Acceso a gimnasio',
        'Uso de equipamiento básico',
        'Vestuarios y duchas',
      ],
      duration: 1,
    },
    {
      type: 'premium',
      name: 'Plan Premium',
      price: 59.99,
      features: [
        'Acceso a gimnasio',
        'Uso de todo el equipamiento',
        'Clases grupales ilimitadas',
        'Vestuarios y duchas',
        'Asesoramiento nutricional',
      ],
      duration: 1,
    },
    {
      type: 'vip',
      name: 'Plan VIP',
      price: 99.99,
      features: [
        'Acceso a gimnasio 24/7',
        'Uso de todo el equipamiento',
        'Clases grupales ilimitadas',
        'Entrenamiento personal (4 sesiones/mes)',
        'Vestuarios premium y spa',
        'Asesoramiento nutricional personalizado',
        'Estacionamiento incluido',
      ],
      duration: 1,
    },
  ];

  getAvailablePlans(): MembershipPlan[] {
    return this.plans;
  }

  async createMembership(data: any) {
    const plan = this.plans.find(p => p.type === data.planType);
    if (!plan) {
      throw new BadRequestError('Plan de membresía inválido');
    }

    const startDate = data.startDate || new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (data.duration || plan.duration));

    const membership = await Membership.create({
      userId: data.userId,
      planType: data.planType,
      status: 'active',
      startDate,
      endDate,
      price: plan.price * (data.duration || plan.duration),
      features: plan.features,
    });

    return membership;
  }

  async getMembershipById(membershipId: string) {
    const membership = await Membership.findById(membershipId).populate('userId', 'firstName lastName email');
    if (!membership) {
      throw new NotFoundError('Membresía no encontrada');
    }
    return membership;
  }

  async getUserMemberships(userId: string) {
    const memberships = await Membership.find({ userId }).sort({ createdAt: -1 });
    return memberships;
  }

  async renewMembership(membershipId: string, months: number = 1) {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new NotFoundError('Membresía no encontrada');
    }

    const plan = this.plans.find(p => p.type === membership.planType);
    if (!plan) {
      throw new BadRequestError('Plan no válido');
    }

    // Extender fecha de fin
    const newEndDate = new Date(membership.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + months);

    membership.endDate = newEndDate;
    membership.status = 'active';
    membership.price += plan.price * months;

    await membership.save();
    return membership;
  }

  async cancelMembership(membershipId: string) {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new NotFoundError('Membresía no encontrada');
    }

    membership.status = 'cancelled';
    await membership.save();
    return membership;
  }

  async getMembershipStatus(membershipId: string) {
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      throw new NotFoundError('Membresía no encontrada');
    }

    const now = new Date();
    const isActive = membership.status === 'active' && 
                     membership.startDate <= now && 
                     membership.endDate >= now;

    const daysRemaining = isActive 
      ? Math.ceil((membership.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      membershipId: membership._id,
      planType: membership.planType,
      status: membership.status,
      isActive,
      startDate: membership.startDate,
      endDate: membership.endDate,
      daysRemaining,
      features: membership.features,
    };
  }
}
