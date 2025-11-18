import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('gym_ch_club');

    // Obtener todos los clientes
    const clients = await db.collection('users')
      .find({ role: 'CLIENT' })
      .sort({ createdAt: -1 })
      .toArray();

    // Obtener todas las membresías
    const memberships = await db.collection('memberships').find({}).toArray();
    
    // Obtener todos los planes de membresía
    const plans = await db.collection('membership_plans').find({}).toArray();

    // Obtener todos los check-ins de hoy
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkIns = await db.collection('check_ins')
      .find({ checkIn: { $gte: startOfDay } })
      .toArray();

    // Crear un mapa de planes por ID para acceso rápido
    const plansMap = new Map(
      plans.map(plan => [plan._id.toString(), plan])
    );

    // Crear un mapa de check-ins activos (usuarios dentro del gym)
    const activeCheckIns = new Map();
    checkIns.forEach(checkIn => {
      const userId = checkIn.userId.toString();
      // Solo considerar como "dentro" si no tiene check-out
      if (!checkIn.checkOut) {
        activeCheckIns.set(userId, checkIn);
      }
    });

    // Combinar clientes con sus membresías
    const sociosWithMemberships = clients.map(client => {
      // Buscar la membresía más reciente del cliente
      const clientMemberships = memberships.filter(
        m => m.userId.toString() === client._id.toString()
      );

      // Ordenar por fecha de inicio y tomar la más reciente
      const latestMembership = clientMemberships.sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )[0];

      let membershipInfo = null;
      
      if (latestMembership) {
        const plan = plansMap.get(latestMembership.planId.toString());
        const now = new Date();
        const endDate = new Date(latestMembership.endDate);
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        membershipInfo = {
          planName: plan?.name || 'Plan Desconocido',
          planType: plan?.type || 'N/A',
          status: latestMembership.status,
          startDate: latestMembership.startDate,
          endDate: latestMembership.endDate,
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          isExpired: endDate < now
        };
      }

      // Verificar si el socio está dentro del gimnasio
      const checkIn = activeCheckIns.get(client._id.toString());
      const isInside = !!checkIn;

      return {
        _id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        createdAt: client.createdAt,
        isActive: client.isActive,
        membership: membershipInfo,
        isInside,
        checkInTime: checkIn?.checkIn || null
      };
    });

    return NextResponse.json(sociosWithMemberships);

  } catch (error) {
    console.error('Error fetching socios:', error);
    return NextResponse.json(
      { error: 'Error al obtener socios' },
      { status: 500 }
    );
  }
}
