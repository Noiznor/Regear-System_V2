import React, { useState, useMemo } from 'react';
import { Users, Search, Edit, Save, X, Shield, Sword, Heart, Star, User } from 'lucide-react';
import { useMembers } from '../utils/memberData';
import { MemberRole } from '../types';

export const ViewMembers: React.FC = () => {
  const { members, loading, updateMember } = useMembers();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<MemberRole>('villager');
  const [editTier, setEditTier] = useState<number>(1);
  const [roleFilter, setRoleFilter] = useState<MemberRole | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<number | 'all'>('all');

  const roleConfig = {
    tank: { 
      icon: Shield, 
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800'
    },
    dps: { 
      icon: Sword, 
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800'
    },
    support: { 
      icon: Star, 
      gradient: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800'
    },
    healer: { 
      icon: Heart, 
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800'
    },
    villager: { 
      icon: User, 
      gradient: 'from-gray-500 to-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-800'
    },
    bsquad: { 
      icon: Shield, 
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800'
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      const matchesTier = tierFilter === 'all' || member.tier === tierFilter;
      return matchesSearch && matchesRole && matchesTier;
    });
  }, [members, searchQuery, roleFilter, tierFilter]);

  const startEditing = (memberName: string, currentRole: MemberRole, currentTier: number) => {
    setEditingMember(memberName);
    setEditRole(currentRole);
    setEditTier(currentTier);
  };

  const saveEdit = () => {
    if (editingMember) {
      updateMember(editingMember, editRole, editTier);
      setEditingMember(null);
    }
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setEditRole('villager');
    setEditTier(1);
  };

  const getRoleStats = () => {
    const stats = {
      tank: 0,
      dps: 0,
      support: 0,
      healer: 0,
      villager: 0,
      bsquad: 0
    };
    
    members.forEach(member => {
      stats[member.role]++;
    });
    
    return stats;
  };

  const getTierStats = () => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0 };
    members.forEach(member => {
      stats[member.tier as keyof typeof stats]++;
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-16 shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 mx-auto mb-8 w-24 h-24 flex items-center justify-center shadow-2xl animate-pulse">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading Members...</h2>
            <p className="text-lg text-gray-600">Please wait while we fetch the member data</p>
          </div>
        </div>
      </div>
    );
  }

  const roleStats = getRoleStats();
  const tierStats = getTierStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Maharlika Members
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            View and manage all guild members' roles and tiers. Changes are saved in real-time and visible to all users.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Member Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Role Stats */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Role Distribution</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(roleStats).map(([role, count]) => {
                  const config = roleConfig[role as MemberRole];
                  const Icon = config.icon;
                  return (
                    <div key={role} className={`${config.bg} rounded-2xl p-6 border-2 ${config.border} shadow-lg`}>
                      <div className="flex items-center justify-between">
                        <div className={`bg-gradient-to-br ${config.gradient} rounded-xl p-3 shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{count}</div>
                          <div className="text-sm font-medium text-gray-600 capitalize">{role}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tier Stats */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Tier Distribution</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(tierStats).map(([tier, count]) => (
                  <div key={tier} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900 mb-2">{count}</div>
                      <div className="text-sm font-medium text-purple-700">Tier {tier}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Search Members</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                  placeholder="Search by IGN..."
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as MemberRole | 'all')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
              >
                <option value="all">All Roles</option>
                <option value="tank">Tank</option>
                <option value="dps">DPS</option>
                <option value="support">Support</option>
                <option value="healer">Healer</option>
                <option value="villager">Villager</option>
                <option value="bsquad">BSquad</option>
              </select>
            </div>

            {/* Tier Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Filter by Tier</label>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
              >
                <option value="all">All Tiers</option>
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
                <option value={4}>Tier 4</option>
              </select>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-700">
              Showing {filteredMembers.length} of {members.length} members
            </p>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Member List</h2>
            
            {filteredMembers.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-3xl p-8 mx-auto mb-6 w-24 h-24 flex items-center justify-center shadow-lg">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl font-medium">No members found</p>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-lg">IGN</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-lg">ID</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-lg">Role</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-lg">Tier</th>
                      <th className="text-center py-4 px-6 font-bold text-gray-900 text-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => {
                      const config = roleConfig[member.role];
                      const Icon = config.icon;
                      const isEditing = editingMember === member.name;
                      
                      return (
                        <tr key={member.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-2 mr-3 shadow-lg">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-bold text-gray-900">{member.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-600 font-mono text-sm">{member.id}</span>
                          </td>
                          <td className="py-4 px-6">
                            {isEditing ? (
                              <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value as MemberRole)}
                                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                              >
                                <option value="tank">Tank</option>
                                <option value="dps">DPS</option>
                                <option value="support">Support</option>
                                <option value="healer">Healer</option>
                                <option value="villager">Villager</option>
                                <option value="bsquad">BSquad</option>
                              </select>
                            ) : (
                              <div className="flex items-center">
                                <div className={`bg-gradient-to-br ${config.gradient} rounded-lg p-2 mr-3 shadow-lg`}>
                                  <Icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-semibold text-gray-900 capitalize">{member.role}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {isEditing ? (
                              <select
                                value={editTier}
                                onChange={(e) => setEditTier(Number(e.target.value))}
                                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                              >
                                <option value={1}>Tier 1</option>
                                <option value={2}>Tier 2</option>
                                <option value={3}>Tier 3</option>
                                <option value={4}>Tier 4</option>
                              </select>
                            ) : (
                              <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                                Tier {member.tier}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center space-x-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={saveEdit}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center"
                                  >
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => startEditing(member.name, member.role, member.tier)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
