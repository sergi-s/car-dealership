import { useState, useEffect } from 'react';
import { Save, Clock, Calendar, AlertCircle } from 'lucide-react';
import { workingHoursService } from '../services/workingHoursService';
import type { WorkingHoursSettings, WorkingHours, SpecialDate } from '../types/vehicle';
import { format } from 'date-fns';

const AdminWorkingHours = () => {
  const [settings, setSettings] = useState<WorkingHoursSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaultOpenTime, setDefaultOpenTime] = useState('09:00');
  const [defaultCloseTime, setDefaultCloseTime] = useState('17:00');
  const [specialDateInput, setSpecialDateInput] = useState('');
  const [specialDateOpen, setSpecialDateOpen] = useState(true);
  const [specialDateOpenTime, setSpecialDateOpenTime] = useState('09:00');
  const [specialDateCloseTime, setSpecialDateCloseTime] = useState('17:00');
  const [specialDateHoliday, setSpecialDateHoliday] = useState(false);
  const [specialDateHolidayName, setSpecialDateHolidayName] = useState('');

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const loadWorkingHours = async () => {
    try {
      const existingSettings = await workingHoursService.getWorkingHoursSettings();
      if (existingSettings) {
        setSettings(existingSettings);
        setDefaultOpenTime(existingSettings.defaultOpenTime);
        setDefaultCloseTime(existingSettings.defaultCloseTime);
      } else {
        // Create default settings
        const defaultSettings: WorkingHoursSettings = {
          id: '',
          defaultOpenTime: '09:00',
          defaultCloseTime: '17:00',
          workingDays: workingHoursService.getDefaultWorkingHours(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading working hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      await workingHoursService.saveWorkingHoursSettings({
        defaultOpenTime,
        defaultCloseTime,
        workingDays: settings.workingDays
      });
      alert('Working hours saved successfully!');
      await loadWorkingHours(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving working hours:', error);
      alert('Error saving working hours');
    } finally {
      setSaving(false);
    }
  };

  const updateDayHours = (dayId: string, updates: Partial<WorkingHours>) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      workingDays: settings.workingDays.map(day => 
        day.id === dayId ? { ...day, ...updates } : day
      )
    });
  };

  const applyDefaultHours = () => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      workingDays: settings.workingDays.map(day => ({
        ...day,
        openTime: day.isOpen && !day.isHoliday ? defaultOpenTime : undefined,
        closeTime: day.isOpen && !day.isHoliday ? defaultCloseTime : undefined
      }))
    });
  };

  const addSpecialDate = () => {
    if (!specialDateInput) return;
    if (!settings) return;
    const newDate: SpecialDate = {
      id: `${specialDateInput}`,
      date: specialDateInput,
      isOpen: specialDateOpen && !specialDateHoliday,
      openTime: specialDateOpen && !specialDateHoliday ? specialDateOpenTime : undefined,
      closeTime: specialDateOpen && !specialDateHoliday ? specialDateCloseTime : undefined,
      isHoliday: specialDateHoliday,
      holidayName: specialDateHoliday ? specialDateHolidayName : undefined,
    };
    setSettings({
      ...settings,
      specialDates: [...(settings.specialDates || []), newDate],
    });
    setSpecialDateInput('');
    setSpecialDateOpen(true);
    setSpecialDateOpenTime('09:00');
    setSpecialDateCloseTime('17:00');
    setSpecialDateHoliday(false);
    setSpecialDateHolidayName('');
  };

  const removeSpecialDate = (id: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      specialDates: (settings.specialDates || []).filter(d => d.id !== id),
    });
  };

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Working Hours Management</h1>
                <p className="text-gray-600 mt-1">Configure your dealership's operating hours and holidays</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={applyDefaultHours}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Reset to Default
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Special Dates Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Special Dates (Future Schedule Exceptions)</h3>
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={specialDateInput}
                  onChange={e => setSpecialDateInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Open</label>
                <input
                  type="checkbox"
                  checked={specialDateOpen}
                  onChange={e => setSpecialDateOpen(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={specialDateHoliday}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
                <input
                  type="time"
                  value={specialDateOpenTime}
                  onChange={e => setSpecialDateOpenTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!specialDateOpen || specialDateHoliday}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Close Time</label>
                <input
                  type="time"
                  value={specialDateCloseTime}
                  onChange={e => setSpecialDateCloseTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!specialDateOpen || specialDateHoliday}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday</label>
                <input
                  type="checkbox"
                  checked={specialDateHoliday}
                  onChange={e => setSpecialDateHoliday(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  value={specialDateHolidayName}
                  onChange={e => setSpecialDateHolidayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!specialDateHoliday}
                  placeholder="e.g., Christmas Day"
                />
              </div>
              <button
                onClick={addSpecialDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4 md:mt-0"
              >
                Add Special Date
              </button>
            </div>
            {/* List of special dates */}
            {settings?.specialDates && settings.specialDates.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">Upcoming Special Dates</h4>
                <ul className="divide-y divide-gray-200">
                  {settings.specialDates
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map(date => (
                      <li key={date.id} className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-medium text-gray-900">{date.date}</span>
                          {date.isHoliday ? (
                            <span className="ml-2 text-red-600">{date.holidayName || 'Holiday (Closed)'}</span>
                          ) : date.isOpen && date.openTime && date.closeTime ? (
                            <span className="ml-2 text-gray-700">Open {date.openTime} - {date.closeTime}</span>
                          ) : (
                            <span className="ml-2 text-gray-500">Closed</span>
                          )}
                        </div>
                        <button
                          onClick={() => removeSpecialDate(date.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {/* Default Hours */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Default Operating Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Open Time</label>
                <input
                  type="time"
                  value={defaultOpenTime}
                  onChange={(e) => setDefaultOpenTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Close Time</label>
                <input
                  type="time"
                  value={defaultCloseTime}
                  onChange={(e) => setDefaultCloseTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Daily Schedule */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Schedule</h3>
            <div className="space-y-4">
              {settings?.workingDays.map((day) => (
                <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-lg font-medium text-gray-900">{dayNames[day.dayOfWeek]}</h4>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={day.isOpen}
                          onChange={(e) => updateDayHours(day.id, { 
                            isOpen: e.target.checked,
                            isHoliday: !e.target.checked 
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Open</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={day.isHoliday}
                          onChange={(e) => updateDayHours(day.id, { 
                            isHoliday: e.target.checked,
                            isOpen: !e.target.checked 
                          })}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Holiday</span>
                      </label>
                    </div>
                  </div>

                  {day.isOpen && !day.isHoliday && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
                        <input
                          type="time"
                          value={day.openTime || ''}
                          onChange={(e) => updateDayHours(day.id, { openTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Close Time</label>
                        <input
                          type="time"
                          value={day.closeTime || ''}
                          onChange={(e) => updateDayHours(day.id, { closeTime: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="text-sm text-gray-500">
                          {day.openTime && day.closeTime ? (
                            <span className="inline-flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {day.openTime} - {day.closeTime}
                            </span>
                          ) : (
                            <span className="text-red-500">Set hours</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {day.isHoliday && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name (Optional)</label>
                      <input
                        type="text"
                        value={day.holidayName || ''}
                        onChange={(e) => updateDayHours(day.id, { holidayName: e.target.value })}
                        placeholder="e.g., Christmas Day, New Year's Day"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {!day.isOpen && !day.isHoliday && (
                    <div className="flex items-center text-gray-500">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Closed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          {settings && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Current Status</h4>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  workingHoursService.isCurrentlyOpen(settings)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {workingHoursService.isCurrentlyOpen(settings) ? 'Currently Open' : 'Currently Closed'}
                </div>
                {!workingHoursService.isCurrentlyOpen(settings) && (
                  <div className="text-sm text-gray-600">
                    Next opening: {(() => {
                      const next = workingHoursService.getNextOpeningTime(settings);
                      return next ? `${next.day} at ${next.time}` : 'No upcoming openings';
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWorkingHours; 