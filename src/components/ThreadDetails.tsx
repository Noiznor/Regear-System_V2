import React from 'react';
import { ArrowLeft, Calendar, Users, Package, Edit, Shield, Sword, Heart, Star } from 'lucide-react';
import { Thread } from '../types';
import { calculateItemTotals } from '../utils/itemCalculator';

interface ThreadDetailsProps {
  thread: Thread;
  onBack: () => void;
  onEdit: () => void;
}

export const ThreadDetails: React.FC<ThreadDetailsProps> = ({ thread, onBack, onEdit }) => {
  const itemTotals = calculateItemTotals(thread);

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
    }
  };

  const totalPlayers = Object.values(thread.roles).reduce((sum, players) => sum + players.length, 0);
  const totalItems = Object.values(itemTotals).reduce((sum, count) => sum + count, 0);
  const totalQuantity = Object.values(thread.roles).reduce((sum, players) => 
    sum + players.reduce((playerSum, player) => playerSum + player.quantity, 0), 0
  );

  const getTierDescription = (tier: number, role: string) => {
    if (tier === 1) {
      return role === 'dps' ? 'Weapon only' : 'Weapon + Armor';
    }
    if (tier === 2) {
      return role === 'dps' ? 'Weapon + Armor' : 'Weapon + Armor + Boots';
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
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors bg-white/80 backdrop-blur-lg rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 duration-200 font-bold text-lg"
          >
            <ArrowLeft className="mr-3 h-6 w-6" />
            <span>Back to Threads</span>
          </button>
          
          <button
            onClick={onEdit}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 flex items-center text-lg"
          >
            <Edit className="mr-3 h-6 w-6" />
            Edit Thread
          </button>
        </div>

        {/* Thread Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/20">
          <div className="text-center mb-10">
            <div className="rounded-3xl p-6 mx-auto mb-8 w-24 h-24 flex items-center justify-center shadow-2xl bg-white">
              <img 
                src="/mahaLogo.png" 
                alt="Maharlika Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Regear Thread Details
            </h1>
            <div className="text-3xl font-bold text-blue-600 mb-3">
              {new Date(thread.utcDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-xl text-gray-600 mb-6">
              {new Date(thread.utcDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </div>
            <p className="text-lg text-gray-500">
              Last modified: {thread.lastModified.toLocaleDateString()}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 mr-3" />
                <span className="text-3xl font-bold">{totalPlayers}</span>
              </div>
              <div className="text-blue-100 text-center font-bold text-lg">Total Players</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center mb-3">
                <Package className="h-8 w-8 mr-3" />
                <span className="text-3xl font-bold">{totalQuantity}</span>
              </div>
              <div className="text-purple-100 text-center font-bold text-lg">Total Regears</div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center mb-3">
                <Star className="h-8 w-8 mr-3" />
                <span className="text-3xl font-bold">{totalItems}</span>
              </div>
              <div className="text-emerald-100 text-center font-bold text-lg">Total Items</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-center mb-3">
                <Package className="h-8 w-8 mr-3" />
                <span className="text-3xl font-bold">{Object.keys(itemTotals).length}</span>
              </div>
              <div className="text-orange-100 text-center font-bold text-lg">Unique Items</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Players by Role */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 mr-4 shadow-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              Players by Role
            </h2>
            
            <div className="space-y-8">
              {Object.entries(thread.roles).map(([role, players]) => (
                players.length > 0 && (
                  <div key={role} className={`rounded-3xl p-8 border-2 ${roleConfig[role as keyof typeof roleConfig].bg} ${roleConfig[role as keyof typeof roleConfig].border} shadow-lg`}>
                    <div className="flex items-center mb-6">
                      <div className={`bg-gradient-to-br ${roleConfig[role as keyof typeof roleConfig].gradient} rounded-2xl p-4 mr-4 shadow-2xl`}>
                        {React.createElement(roleConfig[role as keyof typeof roleConfig].icon, { className: "h-6 w-6 text-white" })}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 capitalize">{role}</h3>
                        <p className="text-lg text-gray-600">{players.length} player{players.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {players.map((player, index) => (
                        <div key={index} className="bg-white/90 rounded-2xl p-6 shadow-lg border border-white/50">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-gray-900 text-xl">{player.ign}</span>
                            <div className="flex items-center space-x-3">
                              <span className="bg-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700">
                                Tier {player.tier}
                              </span>
                              <span className="bg-blue-200 px-4 py-2 rounded-xl text-sm font-bold text-blue-800">
                                x{player.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-4">
                            <p className="text-indigo-800 font-bold text-center">
                              {getTierDescription(player.tier, role)}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 rounded-xl p-3">
                              <strong className="text-gray-700">Weapon:</strong>
                              <div className="text-gray-900 font-bold">{player.selectedGear.weapon || 'None'}</div>
                            </div>
                            
                            {player.selectedGear.offhand && (
                              <div className="bg-gray-50 rounded-xl p-3">
                                <strong className="text-gray-700">Offhand:</strong>
                                <div className="text-gray-900 font-bold">{player.selectedGear.offhand}</div>
                              </div>
                            )}
                            
                            <div className="bg-gray-50 rounded-xl p-3">
                              <strong className="text-gray-700">Headgear:</strong>
                              <div className="text-gray-900 font-bold">
                                {player.selectedGear.headgear || (
                                  (player.tier === 1 || player.tier === 2) ? 
                                  <span className="text-gray-500 italic">Tier Limited</span> : 
                                  'None'
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-3">
                              <strong className="text-gray-700">Armor:</strong>
                              <div className="text-gray-900 font-bold">{player.selectedGear.armor || 'None'}</div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-3">
                              <strong className="text-gray-700">Boots:</strong>
                              <div className="text-gray-900 font-bold">
                                {player.selectedGear.boots || (
                                  (player.tier === 1 || (player.tier === 2 && role === 'dps')) ? 
                                  <span className="text-gray-500 italic">Tier Limited</span> : 
                                  'None'
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Required Items Summary */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 mr-4 shadow-2xl">
                <Package className="h-8 w-8 text-white" />
              </div>
              Required Items
            </h2>
            
            <div className="space-y-4">
              {Object.keys(itemTotals).length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-3xl p-8 mx-auto mb-6 w-24 h-24 flex items-center justify-center shadow-lg">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-xl font-medium">No items required</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(itemTotals)
                    .sort(([, a], [, b]) => b - a)
                    .map(([item, count], index) => (
                      <div key={item} className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-102">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 mr-4 shadow-lg">
                            <span className="text-white font-bold text-lg">#{index + 1}</span>
                          </div>
                          <span className="font-bold text-gray-900 text-lg">{item}</span>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl text-lg">
                          {count}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            {Object.keys(itemTotals).length > 0 && (
              <div className="mt-10 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 shadow-lg">
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-blue-900 mb-2">{totalItems}</div>
                    <div className="text-lg text-blue-700 font-bold">Total Items Needed</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-blue-900 mb-2">{Object.keys(itemTotals).length}</div>
                    <div className="text-lg text-blue-700 font-bold">Different Item Types</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
