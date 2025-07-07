import { collection, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { WorkingHoursSettings, WorkingHours } from '../types/vehicle';

const WORKING_HOURS_COLLECTION = 'workingHours';

export const workingHoursService = {
  // Get working hours settings
  async getWorkingHoursSettings(): Promise<WorkingHoursSettings | null> {
    try {
      const querySnapshot = await getDocs(collection(db, WORKING_HOURS_COLLECTION));
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      // Convert null values back to undefined for the frontend
      const settings: WorkingHoursSettings = {
        id: doc.id,
        defaultOpenTime: data.defaultOpenTime,
        defaultCloseTime: data.defaultCloseTime,
        workingDays: data.workingDays?.map((day: { id: string; dayOfWeek: string; isOpen: boolean; openTime: string | null; closeTime: string | null; isHoliday: boolean; holidayName: string | null }) => ({
          id: day.id,
          dayOfWeek: day.dayOfWeek as WorkingHours['dayOfWeek'],
          isOpen: day.isOpen,
          openTime: day.openTime || undefined,
          closeTime: day.closeTime || undefined,
          isHoliday: day.isHoliday,
          holidayName: day.holidayName || undefined
        })) || [],
        specialDates: data.specialDates?.map((date: { id: string; date: string; isOpen: boolean; openTime: string | null; closeTime: string | null; isHoliday: boolean; holidayName: string | null }) => ({
          id: date.id,
          date: date.date,
          isOpen: date.isOpen,
          openTime: date.openTime || undefined,
          closeTime: date.closeTime || undefined,
          isHoliday: date.isHoliday,
          holidayName: date.holidayName || undefined
        })) || [],
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
      
      return settings;
    } catch (error) {
      console.error('Error fetching working hours settings:', error);
      throw error;
    }
  },

  // Create or update working hours settings
  async saveWorkingHoursSettings(settings: Omit<WorkingHoursSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const existingSettings = await this.getWorkingHoursSettings();
      
      // Clean the settings object to remove undefined values
      const cleanSettings = {
        defaultOpenTime: settings.defaultOpenTime,
        defaultCloseTime: settings.defaultCloseTime,
        workingDays: settings.workingDays.map(day => ({
          id: day.id,
          dayOfWeek: day.dayOfWeek,
          isOpen: day.isOpen,
          openTime: day.openTime || null,
          closeTime: day.closeTime || null,
          isHoliday: day.isHoliday,
          holidayName: day.holidayName || null
        })),
        specialDates: settings.specialDates?.map(date => ({
          id: date.id,
          date: date.date,
          isOpen: date.isOpen,
          openTime: date.openTime || null,
          closeTime: date.closeTime || null,
          isHoliday: date.isHoliday,
          holidayName: date.holidayName || null
        })) || []
      };
      
      if (existingSettings) {
        // Update existing settings
        await updateDoc(doc(db, WORKING_HOURS_COLLECTION, existingSettings.id), {
          ...cleanSettings,
          updatedAt: new Date()
        });
        return existingSettings.id;
      } else {
        // Create new settings
        const docRef = await addDoc(collection(db, WORKING_HOURS_COLLECTION), {
          ...cleanSettings,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving working hours settings:', error);
      throw error;
    }
  },

  // Get default working hours template
  getDefaultWorkingHours(): WorkingHours[] {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    return days.map((day, index) => ({
      id: `day-${index}`,
      dayOfWeek: day,
      isOpen: day !== 'sunday', // Sunday closed by default
      openTime: day === 'monday' ? '09:00' : '09:00', // Monday special hours
      closeTime: day === 'monday' ? '12:00' : '17:00', // Monday closes early
      isHoliday: day === 'sunday',
      holidayName: day === 'sunday' ? 'Sunday - Closed' : undefined
    }));
  },

  // Check if dealership is currently open (with special dates)
  isCurrentlyOpen(settings: WorkingHoursSettings): boolean {
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()] as WorkingHours['dayOfWeek'];
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM" format
    const todayDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // Check for special date override
    if (settings.specialDates && settings.specialDates.length > 0) {
      const special = settings.specialDates.find(d => d.date === todayDate);
      if (special) {
        if (!special.isOpen || special.isHoliday) return false;
        if (!special.openTime || !special.closeTime) return false;
        return currentTime >= special.openTime && currentTime <= special.closeTime;
      }
    }

    const todayHours = settings.workingDays.find(day => day.dayOfWeek === currentDay);
    if (!todayHours || !todayHours.isOpen || todayHours.isHoliday) {
      return false;
    }
    if (!todayHours.openTime || !todayHours.closeTime) {
      return false;
    }
    return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
  },

  // Get next opening time (with special dates)
  getNextOpeningTime(settings: WorkingHoursSettings): { day: string; time: string } | null {
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayIndex = now.getDay();
    // const todayDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // Check special dates for the next 30 days
    if (settings.specialDates && settings.specialDates.length > 0) {
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        const checkDateStr = checkDate.toISOString().slice(0, 10);
        const special = settings.specialDates.find(d => d.date === checkDateStr);
        if (special && special.isOpen && !special.isHoliday && special.openTime) {
          return { day: checkDate.toLocaleDateString(), time: special.openTime };
        }
      }
    }

    // Fallback to weekly schedule
    for (let i = 1; i <= 7; i++) {
      const checkDayIndex = (currentDayIndex + i) % 7;
      const checkDay = days[checkDayIndex] as WorkingHours['dayOfWeek'];
      const dayHours = settings.workingDays.find(day => day.dayOfWeek === checkDay);
      if (dayHours && dayHours.isOpen && !dayHours.isHoliday && dayHours.openTime) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return {
          day: dayNames[checkDayIndex],
          time: dayHours.openTime
        };
      }
    }
    return null;
  }
}; 