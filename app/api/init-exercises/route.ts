import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('gym_ch_club')
    const exercisesCollection = db.collection('exercises')

    // Verificar si ya existen ejercicios
    const existingCount = await exercisesCollection.countDocuments()
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Ya existen ${existingCount} ejercicios en la base de datos`,
      })
    }

    // Ejercicios de ejemplo
    const sampleExercises = [
      // Pecho
      { 
        name: 'Press de Banca', 
        equipment: 'Banca y barra', 
        category: 'Fuerza', 
        description: 'Ejercicio básico para pecho',
        imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-gMEhVMqQ8AcdJhSuBiF6Tg4gW0uLTi.png'
      },
      { name: 'Press Inclinado con Mancuernas', equipment: 'Banca inclinada y mancuernas', category: 'Fuerza', description: 'Trabaja pecho superior' },
      { name: 'Aperturas con Mancuernas', equipment: 'Banca y mancuernas', category: 'Fuerza', description: 'Aislamiento de pecho' },
      { name: 'Fondos en Paralelas', equipment: 'Paralelas', category: 'Fuerza', description: 'Pecho y tríceps' },
      
      // Espalda
      { name: 'Dominadas', equipment: 'Barra de dominadas', category: 'Fuerza', description: 'Ejercicio compuesto para espalda' },
      { name: 'Remo con Barra', equipment: 'Barra', category: 'Fuerza', description: 'Desarrollo de espalda media' },
      { name: 'Peso Muerto', equipment: 'Barra', category: 'Fuerza', description: 'Ejercicio completo de espalda y piernas' },
      { name: 'Jalón al Pecho', equipment: 'Polea alta', category: 'Fuerza', description: 'Alternativa a dominadas' },
      { name: 'Remo en Polea', equipment: 'Polea baja', category: 'Fuerza', description: 'Espalda media y baja' },
      
      // Piernas
      { name: 'Sentadilla', equipment: 'Barra y rack', category: 'Fuerza', description: 'Ejercicio fundamental de piernas' },
      { name: 'Prensa de Piernas', equipment: 'Máquina de prensa', category: 'Fuerza', description: 'Cuádriceps y glúteos' },
      { name: 'Zancadas', equipment: 'Mancuernas', category: 'Fuerza', description: 'Piernas y equilibrio' },
      { name: 'Curl Femoral', equipment: 'Máquina de curl', category: 'Fuerza', description: 'Isquiotibiales' },
      { name: 'Elevación de Talones', equipment: 'Máquina o mancuernas', category: 'Fuerza', description: 'Gemelos' },
      
      // Hombros
      { name: 'Press Militar', equipment: 'Barra', category: 'Fuerza', description: 'Hombro frontal' },
      { name: 'Elevaciones Laterales', equipment: 'Mancuernas', category: 'Fuerza', description: 'Hombro lateral' },
      { name: 'Elevaciones Frontales', equipment: 'Mancuernas o disco', category: 'Fuerza', description: 'Hombro frontal' },
      { name: 'Pájaros', equipment: 'Mancuernas', category: 'Fuerza', description: 'Hombro posterior' },
      { name: 'Press Arnold', equipment: 'Mancuernas', category: 'Fuerza', description: 'Hombros completos' },
      
      // Brazos
      { name: 'Curl con Barra', equipment: 'Barra Z o recta', category: 'Fuerza', description: 'Bíceps' },
      { name: 'Curl con Mancuernas', equipment: 'Mancuernas', category: 'Fuerza', description: 'Bíceps alterno' },
      { name: 'Curl Martillo', equipment: 'Mancuernas', category: 'Fuerza', description: 'Bíceps y antebrazo' },
      { name: 'Press Francés', equipment: 'Barra Z', category: 'Fuerza', description: 'Tríceps' },
      { name: 'Extensiones en Polea', equipment: 'Polea alta', category: 'Fuerza', description: 'Tríceps' },
      { name: 'Fondos para Tríceps', equipment: 'Banca', category: 'Fuerza', description: 'Tríceps' },
      
      // Core/Abdomen
      { name: 'Plancha', equipment: 'Ninguno', category: 'Funcional', description: 'Core completo' },
      { name: 'Crunches', equipment: 'Colchoneta', category: 'Funcional', description: 'Abdomen superior' },
      { name: 'Elevación de Piernas', equipment: 'Colchoneta o barra', category: 'Funcional', description: 'Abdomen inferior' },
      { name: 'Russian Twists', equipment: 'Disco o mancuerna', category: 'Funcional', description: 'Oblicuos' },
      { name: 'Mountain Climbers', equipment: 'Ninguno', category: 'Funcional', description: 'Core dinámico' },
      
      // Cardio
      { name: 'Caminadora', equipment: 'Caminadora', category: 'Cardio', description: 'Cardio de bajo impacto' },
      { name: 'Elíptica', equipment: 'Elíptica', category: 'Cardio', description: 'Cardio de bajo impacto' },
      { name: 'Bicicleta Estática', equipment: 'Bicicleta', category: 'Cardio', description: 'Cardio sentado' },
      { name: 'Remo Cardio', equipment: 'Máquina de remo', category: 'Cardio', description: 'Cardio de cuerpo completo' },
      { name: 'Burpees', equipment: 'Ninguno', category: 'Cardio', description: 'Cardio intenso' },
      
      // Funcional
      { name: 'Kettlebell Swing', equipment: 'Kettlebell', category: 'Funcional', description: 'Movimiento explosivo' },
      { name: 'Box Jump', equipment: 'Caja pliométrica', category: 'Funcional', description: 'Pliometría' },
      { name: 'Balón Medicinal Slam', equipment: 'Balón medicinal', category: 'Funcional', description: 'Potencia' },
      { name: 'TRX Row', equipment: 'TRX', category: 'Funcional', description: 'Espalda con peso corporal' },
      { name: 'Battle Ropes', equipment: 'Cuerdas', category: 'Funcional', description: 'Cardio y fuerza' },
    ]

    // Agregar fecha de creación
    const exercisesWithDates = sampleExercises.map(ex => ({
      ...ex,
      createdAt: new Date(),
    }))

    const result = await exercisesCollection.insertMany(exercisesWithDates)

    return NextResponse.json({
      success: true,
      message: `${result.insertedCount} ejercicios creados exitosamente`,
      data: sampleExercises,
    })
  } catch (error) {
    console.error('Error initializing exercises:', error)
    return NextResponse.json(
      { success: false, error: 'Error al inicializar ejercicios' },
      { status: 500 }
    )
  }
}

// POST - Igual que GET
export async function POST() {
  return GET()
}
