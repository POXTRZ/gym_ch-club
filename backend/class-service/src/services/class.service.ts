import Class from '../../../shared/models/Class';
import { NotFoundError } from '../../../shared/utils/errors';

export class ClassService {
  async getAllClasses() {
    const classes = await Class.find({ isActive: true })
      .populate('trainerId', 'firstName lastName')
      .sort({ name: 1 });
    return classes;
  }

  async createClass(data: any) {
    const newClass = await Class.create({
      name: data.name,
      description: data.description,
      trainerId: data.trainerId,
      schedule: data.schedule,
      capacity: data.capacity,
      duration: data.duration,
      level: data.level || 'all',
      isActive: true,
    });

    await newClass.populate('trainerId', 'firstName lastName');
    return newClass;
  }

  async getClassById(classId: string) {
    const classData = await Class.findById(classId)
      .populate('trainerId', 'firstName lastName email phone');
    
    if (!classData) {
      throw new NotFoundError('Clase no encontrada');
    }
    
    return classData;
  }

  async updateClass(classId: string, updateData: any) {
    const classData = await Class.findByIdAndUpdate(
      classId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('trainerId', 'firstName lastName');

    if (!classData) {
      throw new NotFoundError('Clase no encontrada');
    }

    return classData;
  }

  async deleteClass(classId: string) {
    const classData = await Class.findByIdAndUpdate(
      classId,
      { isActive: false },
      { new: true }
    );

    if (!classData) {
      throw new NotFoundError('Clase no encontrada');
    }

    return classData;
  }

  async getWeeklySchedule() {
    const classes = await Class.find({ isActive: true })
      .populate('trainerId', 'firstName lastName')
      .sort({ 'schedule.dayOfWeek': 1, 'schedule.startTime': 1 });

    // Organizar por día de la semana
    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const schedule: any = {};

    weekDays.forEach((day, index) => {
      schedule[day] = [];
    });

    classes.forEach((classData) => {
      classData.schedule.forEach((scheduleItem) => {
        const day = weekDays[scheduleItem.dayOfWeek];
        schedule[day].push({
          classId: classData._id,
          name: classData.name,
          trainer: classData.trainerId,
          startTime: scheduleItem.startTime,
          endTime: scheduleItem.endTime,
          capacity: classData.capacity,
          level: classData.level,
        });
      });
    });

    // Ordenar cada día por hora de inicio
    Object.keys(schedule).forEach(day => {
      schedule[day].sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
    });

    return schedule;
  }

  async getTrainerClasses(trainerId: string) {
    const classes = await Class.find({ trainerId, isActive: true })
      .sort({ name: 1 });
    return classes;
  }
}
