import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { userService } from '../services/api';
import { Users, Clock, LogIn, LogOut, Calendar, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const StaffPage = () => {
  const { restaurantId } = useParams();
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'server' });

  const roles = [
    { id: 'manager', name: 'Manager' },
    { id: 'cashior', name: 'Cashier' },
    { id: 'server', name: 'Server / Waiter' },
    { id: 'storkeeper', name: 'Storekeeper' },
    { id: 'kitchen staff', name: 'Kitchen Staff' },
  ];

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const fetchData = async () => {
    try {
      const [attendanceRes, staffRes] = await Promise.all([
        api.get(`/staff/attendance/${restaurantId}`),
        userService.getByRestaurant(restaurantId)
      ]);
      
      setAttendance(attendanceRes.data);
      setStaff(staffRes.data);
      
      const active = attendanceRes.data.find(a => a.user_id === user.id && !a.clock_out);
      setActiveSession(active);
    } catch (err) {
      console.error('Failed to fetch staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  const [editingStaff, setEditingStaff] = useState(null);

  const handleEditStaff = (s) => {
    setEditingStaff(s);
    setNewStaff({ name: s.name, email: s.email, password: '', role: s.role });
    setShowAddModal(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await userService.update(editingStaff.id, { ...newStaff });
      } else {
        await userService.create({ ...newStaff, restaurant_id: restaurantId });
      }
      setShowAddModal(false);
      setEditingStaff(null);
      setNewStaff({ name: '', email: '', password: '', role: 'server' });
      fetchData();
    } catch (err) {
      console.error('Failed to save staff:', err);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await userService.delete(id);
      fetchData();
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const handleClockIn = async () => {
    try {
      await api.post('/staff/clock-in', { user_id: user.id, restaurant_id: restaurantId });
      fetchData();
    } catch (err) {
      console.error('Clock in failed:', err);
    }
  };

  const handleClockOut = async () => {
    try {
      await api.post('/staff/clock-out', { user_id: user.id, restaurant_id: restaurantId });
      fetchData();
    } catch (err) {
      console.error('Clock out failed:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-white bg-gray-900 min-h-screen">Loading Staff Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 font-medium transition-colors"
        >
          <Users size={18} />
          Back to Hub
        </button>

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
            <button 
              onClick={() => {
                setEditingStaff(null);
                setNewStaff({ name: '', email: '', password: '', role: 'server' });
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all"
            >
              <Plus size={20} className="text-indigo-500" />
              Add Staff
            </button>
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
          {/* Staff List Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users size={20} className="text-indigo-500" />
                Registered Staff
              </h3>
              <div className="space-y-4">
                {staff.map(s => (
                  <div key={s.id} className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50/50 transition-colors">
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-900 truncate">{s.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{s.role}</p>
                      <p className="text-[10px] text-gray-400 truncate">{s.email}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditStaff(s)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                      >
                        <ShieldCheck size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {staff.length === 0 && (
                  <p className="text-center text-gray-400 text-sm italic py-4">No staff registered yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-indigo-500" />
                Your Status
              </h3>
              {activeSession ? (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Shift Started</p>
                    <p className="text-xl font-bold text-indigo-900">
                      {format(new Date(activeSession.clock_in), 'hh:mm a')}
                    </p>
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
              <div className="p-6 border-b border-gray-100 bg-gray-50/30">
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

        {/* Add Staff Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
              <div className="p-8 bg-indigo-600 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black mb-1">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h2>
                  <p className="text-indigo-100 text-sm">
                    {editingStaff ? `Updating details for ${editingStaff.name}` : 'Create a new employee account.'}
                  </p>
                </div>
                {editingStaff && (
                  <button 
                    onClick={() => handleDeleteStaff(editingStaff.id)}
                    className="p-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-white transition-colors"
                    title="Remove Staff"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <form onSubmit={handleSaveStaff} className="p-8 space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="input-field" 
                    value={newStaff.name}
                    onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="input-field" 
                    value={newStaff.email}
                    onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Password {editingStaff && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}</label>
                  <input 
                    type="password" 
                    required={!editingStaff}
                    className="input-field" 
                    value={newStaff.password}
                    onChange={e => setNewStaff({...newStaff, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select 
                    className="input-field"
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                  >
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditingStaff(null); }} className="flex-1 btn-secondary">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary bg-indigo-600 hover:bg-indigo-700">
                    {editingStaff ? 'Save Changes' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
