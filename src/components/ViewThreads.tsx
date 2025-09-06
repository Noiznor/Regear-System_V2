import React, { useState } from 'react';
import { Calendar, Users, Package, Eye, Shield, Sword, Heart, Star, Trash2, AlertTriangle, Copy, Check } from 'lucide-react';
import { Thread } from '../types';
import { calculateItemTotals } from '../utils/itemCalculator';
import { deleteThread, loadThreads } from '../utils/storage';

interface ViewThreadsProps {
  threads: Thread[];
  onSelectThread: (thread: Thread) => void;
  onThreadDeleted?: () => void;
  onThreadsUpdated?: (threads: Thread[]) => void;
}

export const ViewThreads: React.FC<ViewThreadsProps> = ({ threads, onSelectThread, onThreadDeleted, onThreadsUpdated }) => {
  const [deletingThread, setDeletingThread] = useState<string | null>(null);
  const [copiedThread, setCopiedThread] = useState<string | null>(null);

  const roleIcons = {
    tank: Shield,
    dps: Sword,
    support: Star,
    healer: Heart
  };

  const roleColors = {
    tank: 'from-blue-500 to-blue-600',
    dps: 'from-red-500 to-red-600',
    support: 'from-yellow-500 to-yellow-600',
    healer: 'from-green-500 to-green-600'
  };

  const handleDeleteThread = (threadId: string) => {
    deleteThread(threadId);
    const updatedThreads = loadThreads();
    if (onThreadsUpdated) {
      onThreadsUpdated(updatedThreads);
    }
    setDeletingThread(null);
  };

  const formatThreadForCopy = (thread: Thread): string => {
    const date = new Date(thread.utcDate);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} UTC`;
    
    let output = `${formattedDate} | ${thread.contentName} | ${formattedTime}\n\n`;
    
    // Process each role
    const roleOrder = ['tank', 'support', 'healer', 'dps'] as const;
    
    roleOrder.forEach(role => {
      const roleName = role.charAt(0).toUpperCase() + role.slice(1);
      output += `${roleName}:\n\n`;
      
      const players = thread.roles[role];
      if (players.length > 0) {
        players.forEach(player => {
          const items: string[] = [];
          
          // Add items based on quantity
          for (let i = 0; i < player.quantity; i++) {
            if (player.selectedGear.weapon) {
              items.push(player.selectedGear.weapon.toLowerCase());
            }
            if (player.selectedGear.offhand) {
              items.push(player.selectedGear.offhand.toLowerCase());
            }
            if (player.selectedGear.headgear) {
              items.push(player.selectedGear.headgear.toLowerCase());
            }
            if (player.selectedGear.armor) {
              items.push(player.selectedGear.armor.toLowerCase());
            }
            if (player.selectedGear.boots) {
              items.push(player.selectedGear.boots.toLowerCase());
            }
          }
          
          // Count items and format
          const itemCounts: { [key: string]: number } = {};
          items.forEach(item => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
          });
          
          const itemList = Object.entries(itemCounts)
            .map(([item, count]) => `${count} ${item}`)
            .join(', ');
          
          if (itemList) {
            output += `${player.ign.toLowerCase()} - ${itemList}\n`;
          }
        });
      }
      
      output += '\n';
    });
    
    output += '------------------------------------------------------';
    
    return output;
  };

  const handleCopyThread = async (thread: Thread) => {
    const formattedText = formatThreadForCopy(thread);
    
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopiedThread(thread.id);
      setTimeout(() => setCopiedThread(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = formattedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedThread(thread.id);
      setTimeout(() => setCopiedThread(null), 2000);
    }
  };
  if (threads.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-16 shadow-2xl border border-white/20">
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl p-10 mx-auto mb-8 w-32 h-32 flex items-center justify-center shadow-2xl">
                <Package className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">No Threads Created Yet</h3>
              <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
                Start by creating your first regear thread to organize your guild's equipment needs.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
                <p className="text-blue-800 font-bold text-lg">
                  💡 Tip: Use the "Create Thread" button in the navigation to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Saved Regear Threads
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            View, manage, and delete all your saved regear configurations
          </p>
        </div>
        
        <div className="grid gap-10">
          {threads.map(thread => {
            const itemTotals = calculateItemTotals(thread);
            const totalPlayers = Object.values(thread.roles).reduce((sum, players) => sum + players.length, 0);
            const totalItems = Object.values(itemTotals).reduce((sum, count) => sum + count, 0);
            const totalQuantity = Object.values(thread.roles).reduce((sum, players) => 
              sum + players.reduce((playerSum, player) => playerSum + player.quantity, 0), 0
            );
            
            return (
              <div key={thread.id} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
                  {/* Thread Info */}
                  <div className="flex-1">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-4 mr-6 shadow-2xl">
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">
                          {new Date(thread.utcDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <p className="text-xl text-gray-600">
                          {new Date(thread.utcDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZoneName: 'short'
                          })}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Last modified: {thread.lastModified.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Role Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      {Object.entries(thread.roles).map(([role, players]) => {
                        const Icon = roleIcons[role as keyof typeof roleIcons];
                        const gradient = roleColors[role as keyof typeof roleColors];
                        const roleQuantity = players.reduce((sum, player) => sum + player.quantity, 0);
                        
                        return (
                          <div key={role} className="text-center">
                            <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 shadow-2xl mb-4 transform hover:scale-105 transition-transform duration-200`}>
                              <Icon className="h-8 w-8 text-white mx-auto mb-3" />
                              <div className="text-white font-bold text-2xl">{players.length}</div>
                              <div className="text-white/80 text-sm font-medium">players</div>
                              {roleQuantity > players.length && (
                                <div className="bg-white/20 rounded-xl px-3 py-1 mt-2">
                                  <span className="text-white text-xs font-bold">x{roleQuantity} total</span>
                                </div>
                              )}
                            </div>
                            <p className="font-bold text-gray-900 capitalize text-lg">{role}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                        <div className="flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600 mr-3" />
                          <div className="text-center">
                            <div className="font-bold text-blue-900 text-xl">{totalPlayers}</div>
                            <div className="text-sm text-blue-700 font-medium">Players</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                        <div className="flex items-center justify-center">
                          <Package className="h-6 w-6 text-purple-600 mr-3" />
                          <div className="text-center">
                            <div className="font-bold text-purple-900 text-xl">{totalQuantity}</div>
                            <div className="text-sm text-purple-700 font-medium">Total Regears</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200 shadow-lg">
                        <div className="flex items-center justify-center">
                          <Star className="h-6 w-6 text-emerald-600 mr-3" />
                          <div className="text-center">
                            <div className="font-bold text-emerald-900 text-xl">{totalItems}</div>
                            <div className="text-sm text-emerald-700 font-medium">Total Items</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
                        <div className="flex items-center justify-center">
                          <Package className="h-6 w-6 text-orange-600 mr-3" />
                          <div className="text-center">
                            <div className="font-bold text-orange-900 text-xl">{Object.keys(itemTotals).length}</div>
                            <div className="text-sm text-orange-700 font-medium">Unique Items</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col justify-center space-y-4">
                    <button
                      onClick={() => onSelectThread(thread)}
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
                    >
                      <Eye className="mr-3 h-6 w-6" />
                      View Details
                    </button>

                    <button
                      onClick={() => handleCopyThread(thread)}
                      className={`px-10 py-4 ${
                        copiedThread === thread.id
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600'
                      } text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg`}
                    >
                      {copiedThread === thread.id ? (
                        <>
                          <Check className="mr-3 h-6 w-6" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-3 h-6 w-6" />
                          Copy Thread
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setDeletingThread(thread.id)}
                      className="px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
                    >
                      <Trash2 className="mr-3 h-6 w-6" />
                      Delete Thread
                    </button>
                  </div>
                </div>

                {/* Item Preview */}
                {Object.keys(itemTotals).length > 0 && (
                  <div className="mt-10 pt-8 border-t-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-6 flex items-center text-xl">
                      <Package className="mr-3 h-6 w-6 text-gray-600" />
                      Top Required Items
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(itemTotals)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 10)
                        .map(([item, count]) => (
                          <span key={item} className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-2xl font-bold border-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200">
                            {item}: {count}
                          </span>
                        ))}
                      {Object.keys(itemTotals).length > 10 && (
                        <span className="px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-2xl font-bold border-2 border-blue-300 shadow-lg">
                          +{Object.keys(itemTotals).length - 10} more items...
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Delete Confirmation */}
                {deletingThread === thread.id && (
                  <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 mr-4 shadow-lg">
                        <AlertTriangle className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-red-900 mb-2">Confirm Deletion</h4>
                        <p className="text-red-700 font-medium">This action cannot be undone. Are you sure you want to delete this thread?</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-6">
                      <button
                        onClick={() => setDeletingThread(null)}
                        className="px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteThread(thread.id)}
                        className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        Delete Thread
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
