import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const STATUS_MAP = {
  pending:  { label: 'معلق', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  approved: { label: 'مفعّل', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
  rejected: { label: 'مرفوض', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
  expired:  { label: 'منتهي', color: 'text-gray-400 bg-gray-400/10 border-gray-400/30' },
};

const PACKAGE_MAP = { basic: 'أساسي - 199 ريال', gold: 'ذهبي - 349 ريال', vip: 'VIP - 699 ريال' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/users?role=student&limit=100');
      setStudents(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      await api.patch(`/users/${id}/${action}`);
      await fetchStudents();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = students.filter(s => {
    const matchFilter = filter === 'all' || s.subscriptionStatus === filter;
    const matchSearch = !search || s.name.includes(search) || s.email.includes(search);
    return matchFilter && matchSearch;
  });

  const counts = {
    all: students.length,
    pending: students.filter(s => s.subscriptionStatus === 'pending').length,
    approved: students.filter(s => s.subscriptionStatus === 'approved').length,
    rejected: students.filter(s => s.subscriptionStatus === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة الطلاب</h1>
          <p className="text-[#5e779a] mt-1">مراجعة وإدارة طلبات الاشتراك</p>
        </div>
        <Link to="/admin" className="px-4 py-2 rounded-lg bg-[#1a2d4a] text-[#dfab70] border border-[#dfab70]/20 hover:bg-[#dfab70]/10 transition-colors text-sm">
          ← لوحة التحكم
        </Link>
      </div>

      {/* Stats Tabs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { key: 'all', label: 'الكل', icon: '👥' },
          { key: 'pending', label: 'معلق', icon: '⏳' },
          { key: 'approved', label: 'مفعّل', icon: '✅' },
          { key: 'rejected', label: 'مرفوض', icon: '❌' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`p-4 rounded-xl border transition-all text-right ${
              filter === tab.key
                ? 'bg-[#dfab70]/10 border-[#dfab70]/40 text-[#dfab70]'
                : 'bg-[#0d1f38] border-[#1a2d4a] text-[#5e779a] hover:border-[#5e779a]/50'
            }`}
          >
            <div className="text-2xl mb-1">{tab.icon}</div>
            <div className="text-xl font-bold text-white">{counts[tab.key]}</div>
            <div className="text-sm">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 البحث بالاسم أو البريد..."
          className="w-full md:w-80 px-4 py-2 rounded-lg bg-[#0d1f38] border border-[#1a2d4a] text-white placeholder-[#5e779a] focus:outline-none focus:border-[#dfab70]/50"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0d1f38] rounded-2xl border border-[#1a2d4a] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#5e779a]">
            <div className="w-8 h-8 border-2 border-[#dfab70] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            جاري التحميل...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#5e779a]">لا يوجد طلاب في هذا التصنيف</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2d4a] text-[#5e779a] text-sm">
                  <th className="p-4 text-right">الطالب</th>
                  <th className="p-4 text-right">الباقة</th>
                  <th className="p-4 text-right">الحالة</th>
                  <th className="p-4 text-right">تاريخ التسجيل</th>
                  <th className="p-4 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, i) => {
                  const status = STATUS_MAP[student.subscriptionStatus] || STATUS_MAP.pending;
                  return (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-[#1a2d4a]/50 hover:bg-[#112847]/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#dfab70]/10 border border-[#dfab70]/20 flex items-center justify-center text-[#dfab70] font-bold text-sm">
                            {student.name?.[0] || '؟'}
                          </div>
                          <div>
                            <div className="text-white font-medium">{student.name}</div>
                            <div className="text-[#5e779a] text-xs">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[#dfab70] text-sm">
                          {PACKAGE_MAP[student.selectedPackage] || 'غير محدد'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-3 py-1 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-[#5e779a] text-sm">
                        {new Date(student.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {student.subscriptionStatus !== 'approved' && (
                            <button
                              onClick={() => handleAction(student._id, 'approve')}
                              disabled={!!actionLoading}
                              className="px-3 py-1 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors text-xs disabled:opacity-50"
                            >
                              {actionLoading === student._id + 'approve' ? '...' : 'تفعيل'}
                            </button>
                          )}
                          {student.subscriptionStatus !== 'rejected' && (
                            <button
                              onClick={() => handleAction(student._id, 'reject')}
                              disabled={!!actionLoading}
                              className="px-3 py-1 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-colors text-xs disabled:opacity-50"
                            >
                              {actionLoading === student._id + 'reject' ? '...' : 'رفض'}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
