import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('gym_ch_club');

    // Limpiar datos existentes de socios y membresías
    console.log('Limpiando datos existentes...');
    await db.collection('users').deleteMany({ role: 'CLIENT' });
    await db.collection('memberships').deleteMany({});
    
    // Crear planes de membresía si no existen
    const existingPlans = await db.collection('membership_plans').find({}).toArray();
    let planIds: any = {};

    if (existingPlans.length === 0) {
      console.log('Creando planes de membresía...');
      const plans = [
        {
          name: 'Plan Diario',
          type: 'DAILY',
          price: 100,
          durationDays: 1,
          benefits: ['Acceso por 1 día', 'Uso de todas las instalaciones'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Plan Semanal',
          type: 'WEEKLY',
          price: 500,
          durationDays: 7,
          benefits: ['Acceso por 1 semana', 'Uso de todas las instalaciones'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Plan Mensual',
          type: 'MONTHLY',
          price: 1500,
          durationDays: 30,
          benefits: ['Acceso por 1 mes', 'Uso de todas las instalaciones', '1 evaluación física'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Plan Trimestral',
          type: 'QUARTERLY',
          price: 4000,
          durationDays: 90,
          benefits: ['Acceso por 3 meses', 'Uso de todas las instalaciones', '2 evaluaciones físicas', '10% descuento en productos'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Plan Anual',
          type: 'ANNUAL',
          price: 12000,
          durationDays: 365,
          benefits: ['Acceso por 1 año', 'Uso de todas las instalaciones', 'Evaluaciones físicas mensuales', '20% descuento en productos', 'Plan de nutrición básico'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const plansResult = await db.collection('membership_plans').insertMany(plans);
      const insertedPlans = await db.collection('membership_plans').find({}).toArray();
      
      planIds = {
        daily: insertedPlans.find(p => p.type === 'DAILY')?._id,
        weekly: insertedPlans.find(p => p.type === 'WEEKLY')?._id,
        monthly: insertedPlans.find(p => p.type === 'MONTHLY')?._id,
        quarterly: insertedPlans.find(p => p.type === 'QUARTERLY')?._id,
        annual: insertedPlans.find(p => p.type === 'ANNUAL')?._id
      };
    } else {
      planIds = {
        daily: existingPlans.find(p => p.type === 'DAILY')?._id,
        weekly: existingPlans.find(p => p.type === 'WEEKLY')?._id,
        monthly: existingPlans.find(p => p.type === 'MONTHLY')?._id,
        quarterly: existingPlans.find(p => p.type === 'QUARTERLY')?._id,
        annual: existingPlans.find(p => p.type === 'ANNUAL')?._id
      };
    }

    // Nombres y apellidos para generar usuarios
    const nombres = [
      'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'Pedro', 'Laura', 'Miguel', 'Sofia',
      'José', 'Elena', 'Antonio', 'Isabel', 'Francisco', 'Patricia', 'Manuel', 'Rosa', 'David', 'Cristina',
      'Jorge', 'Marta', 'Rafael', 'Lucía', 'Daniel', 'Paula', 'Javier', 'Sara', 'Ricardo', 'Silvia',
      'Roberto', 'Beatriz', 'Fernando', 'Gabriela', 'Alejandro', 'Valentina', 'Sergio', 'Natalia', 'Pablo', 'Andrea',
      'Raúl', 'Julia', 'Alberto', 'Claudia', 'Marcos', 'Diana', 'Ángel', 'Mónica', 'Víctor', 'Pilar'
    ];

    const apellidos = [
      'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
      'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Chávez', 'Ruiz',
      'Hernández', 'Jiménez', 'Mendoza', 'Vargas', 'Castillo', 'Romero', 'Medina', 'Guerrero', 'Vega', 'Ramos'
    ];

    // Hash de contraseña común
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Generar 60 socios
    console.log('Generando socios...');
    const socios = [];
    const memberships = [];
    const now = new Date();

    for (let i = 0; i < 60; i++) {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)];
      const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)];
      const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)];
      const nombreCompleto = `${nombre} ${apellido1} ${apellido2}`;
      const email = `${nombre.toLowerCase()}.${apellido1.toLowerCase()}${i}@chclub.com`;
      const phone = `55${Math.floor(10000000 + Math.random() * 90000000)}`;

      // Fecha de registro aleatoria en los últimos 12 meses
      const daysAgo = Math.floor(Math.random() * 365);
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const socio = {
        email,
        password: hashedPassword,
        name: nombreCompleto,
        role: 'CLIENT',
        phone,
        createdAt,
        updatedAt: createdAt,
        isActive: true
      };

      socios.push(socio);
    }

    // Insertar socios
    const sociosResult = await db.collection('users').insertMany(socios);
    const insertedSocios = await db.collection('users').find({ role: 'CLIENT' }).toArray();

    console.log('Generando membresías...');
    
    // Crear membresías para los socios
    for (let i = 0; i < insertedSocios.length; i++) {
      const socio = insertedSocios[i];
      const random = Math.random();
      
      // 85% tendrán membresía activa, 10% expirada, 5% sin membresía
      if (random < 0.85) {
        // Membresía activa
        let planId, durationDays;
        const planRandom = Math.random();
        
        if (planRandom < 0.50) { // 50% mensual
          planId = planIds.monthly;
          durationDays = 30;
        } else if (planRandom < 0.75) { // 25% trimestral
          planId = planIds.quarterly;
          durationDays = 90;
        } else if (planRandom < 0.90) { // 15% anual
          planId = planIds.annual;
          durationDays = 365;
        } else { // 10% semanal
          planId = planIds.weekly;
          durationDays = 7;
        }

        // Fecha de inicio aleatoria en los últimos 2 meses
        const startDaysAgo = Math.floor(Math.random() * 60);
        const startDate = new Date(now.getTime() - startDaysAgo * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

        memberships.push({
          userId: socio._id,
          planId,
          startDate,
          endDate,
          status: 'ACTIVE',
          autoRenewal: Math.random() < 0.7, // 70% con renovación automática
          createdAt: startDate,
          updatedAt: startDate
        });
      } else if (random < 0.95) {
        // Membresía expirada
        const planId = Math.random() < 0.6 ? planIds.monthly : planIds.quarterly;
        const durationDays = planId === planIds.monthly ? 30 : 90;
        
        // Expirada hace 1-30 días
        const endDaysAgo = Math.floor(Math.random() * 30) + 1;
        const endDate = new Date(now.getTime() - endDaysAgo * 24 * 60 * 60 * 1000);
        const startDate = new Date(endDate.getTime() - durationDays * 24 * 60 * 60 * 1000);

        memberships.push({
          userId: socio._id,
          planId,
          startDate,
          endDate,
          status: 'EXPIRED',
          autoRenewal: false,
          createdAt: startDate,
          updatedAt: endDate
        });
      }
      // 5% sin membresía (no se agrega nada)
    }

    await db.collection('memberships').insertMany(memberships);

    // Crear empleados y entrenadores adicionales
    console.log('Generando personal...');
    const personal = [];

    // 3 entrenadores adicionales
    const trainersData = [
      { name: 'Roberto Fitness Hernández', email: 'roberto.hernandez@chclub.com' },
      { name: 'María Elena Fuerza Torres', email: 'maria.torres@chclub.com' },
      { name: 'Carlos Alberto Wellness Sánchez', email: 'carlos.sanchez@chclub.com' }
    ];

    for (const trainerData of trainersData) {
      personal.push({
        email: trainerData.email,
        password: hashedPassword,
        name: trainerData.name,
        role: 'TRAINER',
        phone: `55${Math.floor(10000000 + Math.random() * 90000000)}`,
        createdAt: new Date(now.getTime() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        isActive: true
      });
    }

    // 2 empleados adicionales
    const employeesData = [
      { name: 'Ana Patricia Recepción López', email: 'ana.lopez@chclub.com' },
      { name: 'José Luis Ventas García', email: 'jose.garcia@chclub.com' }
    ];

    for (const empData of employeesData) {
      personal.push({
        email: empData.email,
        password: hashedPassword,
        name: empData.name,
        role: 'EMPLOYEE',
        phone: `55${Math.floor(10000000 + Math.random() * 90000000)}`,
        createdAt: new Date(now.getTime() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        isActive: true
      });
    }

    await db.collection('users').insertMany(personal);

    // Generar algunos check-ins aleatorios para hoy
    console.log('Generando check-ins...');
    const checkIns = [];
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);
    
    // 30-40% de los socios activos hacen check-in hoy
    const sociosActivos = insertedSocios.filter((_, i) => i < Math.floor(insertedSocios.length * 0.85));
    const numCheckIns = Math.floor(sociosActivos.length * 0.35);

    for (let i = 0; i < numCheckIns; i++) {
      const socio = sociosActivos[Math.floor(Math.random() * sociosActivos.length)];
      const horasDesdeApertura = Math.floor(Math.random() * 14); // Entre 6am y 8pm
      const minutosAleatorios = Math.floor(Math.random() * 60);
      const checkInTime = new Date(todayStart.getTime() + horasDesdeApertura * 60 * 60 * 1000 + minutosAleatorios * 60 * 1000);
      
      // 30% ya hicieron check-out
      const hasCheckOut = Math.random() < 0.3;
      const checkOutTime = hasCheckOut 
        ? new Date(checkInTime.getTime() + (Math.floor(Math.random() * 3) + 1) * 60 * 60 * 1000)
        : null;

      checkIns.push({
        userId: socio._id,
        checkIn: checkInTime,
        checkOut: checkOutTime,
        createdAt: checkInTime,
        updatedAt: checkOutTime || checkInTime
      });
    }

    if (checkIns.length > 0) {
      await db.collection('check_ins').insertMany(checkIns);
    }

    const stats = {
      sociosCreados: insertedSocios.length,
      membresiasCreadas: memberships.length,
      personalCreado: personal.length,
      checkInsCreados: checkIns.length,
      membresiasActivas: memberships.filter(m => m.status === 'ACTIVE').length,
      membresiasExpiradas: memberships.filter(m => m.status === 'EXPIRED').length,
      sinMembresia: insertedSocios.length - memberships.length,
      dentroDelGym: checkIns.filter(c => !c.checkOut).length
    };

    return NextResponse.json({
      success: true,
      message: 'Base de datos poblada exitosamente',
      stats
    });

  } catch (error) {
    console.error('Error poblando la base de datos:', error);
    return NextResponse.json(
      { error: 'Error al poblar la base de datos', details: error },
      { status: 500 }
    );
  }
}
