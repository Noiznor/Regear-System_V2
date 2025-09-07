import React, { useState } from 'react';
import { Calendar, Users, Plus, Save, Trash2, Shield, Sword, Heart, Star, Package } from 'lucide-react';
import { Thread, RoleType, Player, GearPreset } from '../types';
import { getPresetsByRole } from '../data/gearPresets';
import { getTierLimitedGear } from '../utils/itemCalculator';
import { generateId } from '../utils/storage';

interface CreateThreadProps {
  onSaveThread: (thread: Thread) => void;
  existingThread?: Thread;
}

export const CreateThread: React.FC<CreateThreadProps> = ({ onSaveThread, existingThread }) => {
  const [utcDate, setUtcDate] = useState(existingThread?.utcDate || '');
  const [contentName, setContentName] = useState(existingThread?.contentName || 'CASTLE');
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null);
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>([]);
  const [thread, setThread] = useState<Thread>(existingThread || {
    id: generateId(),
    utcDate: '',
    contentName: 'CASTLE',
    roles: { tank: [], dps: [], support: [], healer: [] },
    createdAt: new Date(),
    lastModified: new Date()
  });

  const roleConfig = {
    tank: { 
      color: 'blue', 
      icon: Shield, 
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    dps: { 
      color: 'red', 
      icon: Sword, 
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      button: 'bg-red-600 hover:bg-red-700'
    },
    support: { 
      color: 'yellow', 
      icon: Star, 
      gradient: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    healer: { 
      color: 'green', 
      icon: Heart, 
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  const selectRole = (role: RoleType) => {
    setCurrentRole(role);
    setPlayerCount(1);
    setCurrentPlayers([]);
  };

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const players: Player[] = Array.from({ length: count }, () => ({
      ign: '',
      tier: 4,
      selectedGear: { weapon: '', headgear: '', armor: '', boots: '' },
      quantity: 1
    }));
    setCurrentPlayers(players);
  };

  const updatePlayer = (index: number, field: keyof Player, value: any) => {
    const updated = [...currentPlayers];
    if (field === 'selectedGear') {
      const tierLimitedGear = getTierLimitedGear(value, updated[index].tier, currentRole!);
      updated[index] = { ...updated[index], [field]: tierLimitedGear };
    } else {
      updated[index] = { ...updated[index], [field]: value };
      
      if (field === 'tier') {
        const tierLimitedGear = getTierLimitedGear(updated[index].selectedGear, value, currentRole!);
        updated[index].selectedGear = tierLimitedGear;
      }
    }
    setCurrentPlayers(updated);
  };

  const confirmPlayers = () => {
    if (currentRole && currentPlayers.every(p => p.ign.trim())) {
      setThread(prev => ({
        ...prev,
        utcDate,
        contentName,
        roles: {
          ...prev.roles,
          [currentRole]: [...prev.roles[currentRole], ...currentPlayers]
        },
        lastModified: new Date()
      }));
      setCurrentPlayers([]);
      setCurrentRole(null);
      setPlayerCount(1);
    }
  };

  const removePlayer = (role: RoleType, index: number) => {
    setThread(prev => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: prev.roles[role].filter((_, i) => i !== index)
      },
      lastModified: new Date()
    }));
  };

  const saveThread = () => {
    if (utcDate && contentName && Object.values(thread.roles).some(players => players.length > 0)) {
      onSaveThread({ ...thread, utcDate, contentName });
      setThread({
        id: generateId(),
        utcDate: '',
        contentName: 'CASTLE',
        roles: { tank: [], dps: [], support: [], healer: [] },
        createdAt: new Date(),
        lastModified: new Date()
      });
      setUtcDate('');
      setContentName('CASTLE');
      setCurrentPlayers([]);
      setCurrentRole(null);
      setPlayerCount(1);
    }
  };

  const presets = currentRole ? getPresetsByRole(currentRole) : {};

  const getTierDescription = (tier: number, role: string) => {
    if (tier === 1) {
      return role === 'dps' ? 'Weapon only' : 'Weapon + Chest Armor';
    }
    if (tier === 2) {
      return role === 'dps' ? 'Weapon + Chest Armor' : 'Weapon + Chest Armor + Boots';
    }
    if (tier === 3 || tier === 4) {
      return 'Full regear (all items)';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {existingThread ? 'Modify Thread' : 'Create New Regear Thread'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Configure player roles and gear presets for your regear operation with tier-based limitations
          </p>
        </div>

        {/* UTC Date Input */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="flex items-center justify-center mb-8">
            <div className="rounded-3xl p-4 shadow-2xl bg-white">
              <img 
                src="/mahaLogo.png" 
                alt="Maharlika Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Event Details</h2>
            <p className="text-lg text-gray-600">Set the UTC date and time for this regear thread</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
              UTC Date & Time
            </label>
            <input
              type="datetime-local"
              value={utcDate}
              onChange={(e) => setUtcDate(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg text-center font-semibold bg-white/90"
              required
            />
          </div>
          
          <div className="max-w-md mx-auto mt-8">
            <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
              Content Name
            </label>
            <input
              type="text"
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg text-center font-semibold bg-white/90"
              placeholder="e.g., CASTLE, DUNGEON, RAID"
              required
            />
          </div>
        </div>

        {/* Role Selection */}
        {!currentRole && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Role to Add</h2>
              <p className="text-lg text-gray-600">Choose which role you want to configure players for</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(['tank', 'dps', 'support', 'healer'] as RoleType[]).map(role => {
                const config = roleConfig[role];
                const Icon = config.icon;
                
                return (
                  <button
                    key={role}
                    onClick={() => selectRole(role)}
                    className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-gray-200 p-8 hover:border-transparent hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-6 mx-auto mb-6 w-20 h-20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 capitalize">{role}</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {role === 'tank' && 'Frontline defenders with heavy armor'}
                        {role === 'dps' && 'High damage dealers and damage output'}
                        {role === 'support' && 'Utility and team enhancement'}
                        {role === 'healer' && 'Team restoration and healing'}
                      </p>
                      <div className="bg-gray-100 rounded-xl px-4 py-2">
                        <span className="text-sm font-bold text-gray-700">
                          {thread.roles[role].length} players added
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Player Count Selection */}
        {currentRole && currentPlayers.length === 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
            <div className="text-center mb-10">
              <div className={`bg-gradient-to-br ${roleConfig[currentRole].gradient} rounded-3xl p-6 mx-auto mb-6 w-20 h-20 flex items-center justify-center shadow-2xl`}>
                {React.createElement(roleConfig[currentRole].icon, { className: "h-10 w-10 text-white" })}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
                Adding {currentRole} Players
              </h2>
              <p className="text-lg text-gray-600">How many {currentRole} players do you want to add?</p>
            </div>

            <div className="max-w-lg mx-auto">
              <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
                Number of Players
              </label>
              <div className="flex items-center space-x-6">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(Number(e.target.value))}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-center text-2xl font-bold bg-white/90"
                />
                <button
                  onClick={() => handlePlayerCountChange(playerCount)}
                  disabled={playerCount < 1}
                  className={`px-10 py-4 ${roleConfig[currentRole].button} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 text-lg`}
                >
                  Continue
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentRole(null)}
                className="px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Back to Role Selection
              </button>
            </div>
          </div>
        )}

        {/* Player Configuration */}
        {currentRole && currentPlayers.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
            <div className="text-center mb-10">
              <div className={`bg-gradient-to-br ${roleConfig[currentRole].gradient} rounded-3xl p-6 mx-auto mb-6 w-20 h-20 flex items-center justify-center shadow-2xl`}>
                {React.createElement(roleConfig[currentRole].icon, { className: "h-10 w-10 text-white" })}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
                Configure {currentRole} Players
              </h3>
              <p className="text-lg text-gray-600">Set up each player's IGN, tier, quantity, and gear preset</p>
            </div>
            
            <div className="space-y-8">
              {currentPlayers.map((player, index) => (
                <div key={index} className={`${roleConfig[currentRole].bg} rounded-3xl p-8 border-2 ${roleConfig[currentRole].border} shadow-lg`}>
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-2xl font-bold text-gray-900">
                      Player {index + 1}
                    </h4>
                    <div className={`px-6 py-2 ${roleConfig[currentRole].button} text-white rounded-2xl text-lg font-bold shadow-lg`}>
                      {currentRole.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        IGN (In-Game Name)
                      </label>
                      <input
                        type="text"
                        value={player.ign}
                        onChange={(e) => updatePlayer(index, 'ign', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                        placeholder="Enter player name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Player Tier
                      </label>
                      <select
                        value={player.tier}
                        onChange={(e) => updatePlayer(index, 'tier', Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                      >
                        {[1, 2, 3, 4].map(tier => (
                          <option key={tier} value={tier}>Tier {tier}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={player.quantity}
                        onChange={(e) => updatePlayer(index, 'quantity', Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90 text-center font-bold"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Gear Preset
                      </label>
                      <select
                        onChange={(e) => {
                          const preset = presets[e.target.value];
                          if (preset) {
                            updatePlayer(index, 'selectedGear', preset);
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                      >
                        <option value="">Select preset...</option>
                        {Object.keys(presets).map(presetName => (
                          <option key={presetName} value={presetName}>
                            {presetName}
                          </option>
                        ))}
                        <option value="custom">Custom Gear</option>
                      </select>
                    </div>
                  </div>

                  {/* Tier Limitation Info */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-3 mr-4 shadow-lg">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-indigo-900 text-lg">Tier {player.tier} Regear Policy</p>
                        <p className="text-indigo-700 font-medium">{getTierDescription(player.tier, currentRole)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Weapon</label>
                      <input
                        type="text"
                        value={player.selectedGear.weapon}
                        onChange={(e) => updatePlayer(index, 'selectedGear', {
                          ...player.selectedGear,
                          weapon: e.target.value
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                        placeholder="Weapon name"
                      />
                    </div>
                    
                    {player.selectedGear.offhand !== undefined && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Offhand</label>
                        <input
                          type="text"
                          value={player.selectedGear.offhand || ''}
                          onChange={(e) => updatePlayer(index, 'selectedGear', {
                            ...player.selectedGear,
                            offhand: e.target.value
                          })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                          placeholder="Offhand item"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Headgear {(player.tier === 1 || (player.tier === 2 && currentRole === 'dps')) && '(Tier Limited)'}
                      </label>
                      <input
                        type="text"
                        value={(player.tier === 1 || (player.tier === 2 && currentRole === 'dps')) ? '' : player.selectedGear.headgear}
                        onChange={(e) => updatePlayer(index, 'selectedGear', {
                          ...player.selectedGear,
                          headgear: e.target.value
                        })}
                        disabled={player.tier === 1 || (player.tier === 2 && currentRole === 'dps')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 transition-all duration-200 bg-white/90"
                        placeholder={player.tier === 1 || (player.tier === 2 && currentRole === 'dps') ? "Not available for this tier" : "Headgear name"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Armor</label>
                      <input
                        type="text"
                        value={player.selectedGear.armor}
                        onChange={(e) => updatePlayer(index, 'selectedGear', {
                          ...player.selectedGear,
                          armor: e.target.value
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                        placeholder="Armor name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Boots {(player.tier === 1 || (player.tier === 2 && currentRole === 'dps')) && '(Tier Limited)'}
                      </label>
                      <input
                        type="text"
                        value={(player.tier === 1 || (player.tier === 2 && currentRole === 'dps')) ? '' : player.selectedGear.boots}
                        onChange={(e) => updatePlayer(index, 'selectedGear', {
                          ...player.selectedGear,
                          boots: e.target.value
                        })}
                        disabled={player.tier === 1 || (player.tier === 2 && currentRole === 'dps')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 transition-all duration-200 bg-white/90"
                        placeholder={player.tier === 1 || (player.tier === 2 && currentRole === 'dps') ? "Not available for this tier" : "Boots name"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-6 mt-10">
              <button
                onClick={() => {
                  setCurrentPlayers([]);
                  setCurrentRole(null);
                  setPlayerCount(1);
                }}
                className="px-10 py-4 text-gray-600 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-bold text-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmPlayers}
                disabled={!currentPlayers.every(p => p.ign.trim())}
                className={`px-10 py-4 ${roleConfig[currentRole].button} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center text-lg`}
              >
                <Plus className="mr-3 h-6 w-6" />
                Add {currentPlayers.length} Player{currentPlayers.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Thread Summary */}
        {Object.entries(thread.roles).some(([_, players]) => players.length > 0) && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Thread Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {Object.entries(thread.roles).map(([role, players]) => (
                players.length > 0 && (
                  <div key={role} className={`rounded-3xl p-8 border-2 ${roleConfig[role as RoleType].bg} ${roleConfig[role as RoleType].border} shadow-lg`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`bg-gradient-to-br ${roleConfig[role as RoleType].gradient} rounded-2xl p-3 shadow-lg`}>
                        {React.createElement(roleConfig[role as RoleType].icon, { className: "h-6 w-6 text-white" })}
                      </div>
                      <span className="text-lg font-bold text-gray-600">{players.length} players</span>
                    </div>
                    
                    <h4 className="font-bold capitalize mb-4 text-gray-900 text-xl">{role}</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {players.map((player, index) => (
                        <div key={index} className="flex justify-between items-center bg-white/80 rounded-xl p-4 shadow-sm">
                          <div>
                            <span className="font-bold text-gray-900">{player.ign}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-600">T{player.tier}</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-bold">
                                x{player.quantity}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removePlayer(role as RoleType, index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl p-2 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>

            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setCurrentRole(null)}
                className="px-10 py-4 text-blue-600 border-2 border-blue-300 rounded-2xl hover:bg-blue-50 transition-all duration-200 font-bold text-lg flex items-center"
              >
                <Plus className="mr-3 h-6 w-6" />
                Add More Roles
              </button>
              
              <button
                onClick={saveThread}
                disabled={!utcDate || !contentName || !Object.values(thread.roles).some(players => players.length > 0)}
                className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center text-lg"
              >
                <Save className="mr-3 h-6 w-6" />
                Save Thread
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
