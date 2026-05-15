import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Clock, LogIn, LogOut, Calendar, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export const StaffPage = () => {
  const { restaurantId } = useParams();
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [restaurantId]);

  const fetchAttendance = async () => {
    try {
      const { data } = await api.get(`/staff/attendance/${restaurantId}`);
      setAttendance(data);
      
      // Check if current user is clocked in
      const active = data.find(a => a.user_id === user.id && !a.clock_out);
      setActiveSession(active);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      await api.post('/staff/clock-in', { user_id: user.id, restaurant_id: restaurantId });
      fetchAttendance();
    } catch (err) {
      console.error('Clock in failed:', err);
    }
  };

  const handleClockOut = async () => {
    try {
      await api.post('/staff/clock-out', { user_id: user.id, restaurant_id: restaurantId });
      fetchAttendance();
    } catch (err) {
      console.error('Clock out failed:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-white bg-gray-900 min-h-screen">Loading Staff Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-display font-black text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                <Users size={28} />
              </div>
              Staff Management
            </h1>
            <p className="text-gray-500">Monitor attendance, shifts, and employee performance.</p>
          </div>
          
          <div className="flex gap-4">
            {!activeSession ? (
              <button 
                onClick={handleClockIn}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
              >
                <LogIn size={20} />
                Clock In
              </button>
            ) : (
              <button 
                onClick={handleClockOut}
                className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all active:scale-95"
              >
                <LogOut size={20} />
                Clock Out
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-indigo-500" />
                Current Status
              </h3>
              {activeSession ? (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Shift Started</p>
                    <p className="text-xl font-bold text-indigo-900">
                      {format(new Date(activeSession.clock_in), 'hh:mm a')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <ShieldCheck size={16} />
                    Active Session Verified
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium italic">You are currently off-duty.</p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Log */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar size={20} className="text-indigo-500" />
                  Attendance Log
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Clock In</th>
                      <th className="px-6 py-4">Clock Out</th>
                      <th className="px-6 py-4">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {attendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-5 font-bold text-gray-900">{record.user_name}</td>
                        <td className="px-6 py-5 text-gray-600">{format(new Date(record.clock_in), 'MMM dd, hh:mm a')}</td>
                        <td className="px-6 py-5 text-gray-600">
                          {record.clock_out ? format(new Date(record.clock_out), 'hh:mm a') : (
                            <span className="text-emerald-500 font-black animate-pulse uppercase tracking-widest text-[10px]">On Duty</span>
                          )}
                        </td>
                        <td className="px-6 py-5 font-medium text-gray-900">
                          {record.clock_out ? (
                            `${Math.round((new Date(record.clock_out) - new Date(record.clock_in)) / 3600000)}h`
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
