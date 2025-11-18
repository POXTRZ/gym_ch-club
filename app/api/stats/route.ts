import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('gym_ch_club');

    // Fecha actual
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Estadísticas de Miembros
    const totalMembers = await db.collection('users').countDocuments({ role: 'CLIENT' });
    
    const activeMemberships = await db.collection('memberships').countDocuments({
      status: 'ACTIVE',
      endDate: { $gte: now }
    });
    
    const expiredMemberships = await db.collection('memberships').countDocuments({
      status: 'EXPIRED'
    });

    const newMembersThisMonth = await db.collection('users').countDocuments({
      role: 'CLIENT',
      createdAt: { $gte: startOfMonth }
    });

    // 2. Estadísticas de Ingresos
    const revenueThisMonth = await db.collection('sales').aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).toArray();

    const revenueLastMonth = await db.collection('sales').aggregate([
      { $match: { 
        createdAt: { 
          $gte: startOfLastMonth,
          $lte: endOfLastMonth
        } 
      }},
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).toArray();

    const monthlyRevenue = revenueThisMonth[0]?.total || 0;
    const lastMonthRevenue = revenueLastMonth[0]?.total || 0;
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // 3. Estadísticas de Check-ins
    const checkInsToday = await db.collection('check_ins').countDocuments({
      checkIn: { $gte: startOfToday }
    });

    const checkInsThisMonth = await db.collection('check_ins').countDocuments({
      checkIn: { $gte: startOfMonth }
    });

    // 4. Estadísticas de Ventas
    const productSales = await db.collection('sales').aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $unwind: '$products' },
      { $group: { _id: null, total: { $sum: '$products.quantity' } } }
    ]).toArray();

    const totalProductsSold = productSales[0]?.total || 0;

    // 5. Productos con bajo stock
    const lowStockProducts = await db.collection('products').countDocuments({
      $expr: { $lte: ['$stock', '$minStock'] }
    });

    // 6. Estadísticas de Personal
    const totalEmployees = await db.collection('users').countDocuments({ role: 'EMPLOYEE' });
    const totalTrainers = await db.collection('users').countDocuments({ role: 'TRAINER' });

    // 7. Rutinas activas
    const activeRoutines = await db.collection('routines').countDocuments();

    // 8. Ventas por día (últimos 7 días)
    const salesByDay = await db.collection('sales').aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Formatear salesByDay para los últimos 7 días
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = salesByDay.find(s => s._id === dateStr);
      
      last7Days.push({
        date: dateStr,
        day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        sales: dayData?.total || 0,
        count: dayData?.count || 0
      });
    }

    // 9. Horas pico (análisis de check-ins por hora)
    const peakHours = await db.collection('check_ins').aggregate([
      {
        $match: {
          checkIn: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $hour: '$checkIn' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]).toArray();

    const formattedPeakHours = peakHours.map(ph => ({
      hour: `${ph._id}:00`,
      count: ph.count
    }));

    // 10. Actividades recientes (últimas 5)
    const recentSales = await db.collection('sales').aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'users',
          let: { empId: '$employeeId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$empId'] },
                    { $eq: [{ $toString: '$_id' }, { $toString: '$$empId' }] }
                  ]
                }
              }
            }
          ],
          as: 'employee'
        }
      },
      {
        $project: {
          type: { $literal: 'sale' },
          description: {
            $concat: [
              'Venta de $',
              { $toString: '$total' },
              {
                $cond: {
                  if: { $gt: [{ $size: '$employee' }, 0] },
                  then: {
                    $concat: [' por ', { $arrayElemAt: ['$employee.name', 0] }]
                  },
                  else: ''
                }
              }
            ]
          },
          time: '$createdAt'
        }
      }
    ]).toArray();

    const recentCheckIns = await db.collection('check_ins').aggregate([
      { $sort: { checkIn: -1 } },
      { $limit: 2 },
      {
        $lookup: {
          from: 'users',
          let: { uId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$uId'] },
                    { $eq: [{ $toString: '$_id' }, { $toString: '$$uId' }] }
                  ]
                }
              }
            }
          ],
          as: 'user'
        }
      },
      {
        $project: {
          type: { $literal: 'checkin' },
          description: {
            $concat: [
              'Check-in',
              {
                $cond: {
                  if: { $gt: [{ $size: '$user' }, 0] },
                  then: {
                    $concat: [' de ', { $arrayElemAt: ['$user.name', 0] }]
                  },
                  else: ''
                }
              }
            ]
          },
          time: '$checkIn'
        }
      }
    ]).toArray();

    const recentActivities = [...recentSales, ...recentCheckIns]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 4);

    // Respuesta con todas las estadísticas
    return NextResponse.json({
      totalMembers,
      activeMembers: activeMemberships,
      expiredMembers: expiredMemberships,
      newMembersThisMonth,
      monthlyRevenue,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      checkInsToday,
      checkInsThisMonth,
      productSales: totalProductsSold,
      lowStockProducts,
      totalEmployees,
      totalTrainers,
      activeRoutines,
      salesByDay: last7Days,
      peakHours: formattedPeakHours,
      recentActivities
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
