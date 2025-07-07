import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { workingHoursService } from '../services/workingHoursService';
import type { WorkingHoursSettings } from '../types/vehicle';

const WorkingHoursDisplay = () => {
  const [settings, setSettings] = useState<WorkingHoursSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const loadWorkingHours = async () => {
    try {
      const workingHours = await workingHoursService.getWorkingHoursSettings();
      setSettings(workingHours);
    } catch (error) {
      console.error('Error loading working hours:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return null; // Don't show anything if no working hours are set
  }

  const isOpen = workingHoursService.isCurrentlyOpen(settings);
  const nextOpening = workingHoursService.getNextOpeningTime(settings);

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isOpen
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {isOpen ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              Open Now
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 mr-1" />
              Closed
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {settings.workingDays.map((day) => (
          <div key={day.id} className="flex justify-between items-center text-sm">
            <span className="text-gray-700">{dayNames[day.dayOfWeek]}</span>
            <span className="text-gray-900">
              {day.isHoliday ? (
                <span className="text-red-600">
                  {day.holidayName || 'Closed'}
                </span>
              ) : day.isOpen && day.openTime && day.closeTime ? (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {day.openTime} - {day.closeTime}
                </span>
              ) : (
                <span className="text-gray-500">Closed</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {!isOpen && nextOpening && (
        <div className="text-sm text-gray-600 border-t pt-3">
          <span>Next opening: {nextOpening.day} at {nextOpening.time}</span>
        </div>
      )}
    </div>
  );
};

export default WorkingHoursDisplay; 