import React from 'react';
import { Shield, Sword, Heart, Star, Calendar, Users, Package } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Maharlika Regear System
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Advanced player regear management with role-based gear presets, tier limitations, 
            and comprehensive item tracking for seamless guild operations.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tank Roles</h3>
              <p className="text-gray-600 leading-relaxed">
                Heavy armor and defensive gear configurations for frontline protection and damage mitigation
              </p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sword className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">DPS Roles</h3>
              <p className="text-gray-600 leading-relaxed">
                High damage weapons and mobility gear optimized for maximum offensive output
              </p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Support Roles</h3>
              <p className="text-gray-600 leading-relaxed">
                Utility builds and enhancement gear for team coordination and battlefield control
              </p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Healer Roles</h3>
              <p className="text-gray-600 leading-relaxed">
                Restoration gear and healing equipment to maintain team sustainability
              </p>
            </div>
          </div>

          {/* System Features */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 mt-16 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">System Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div className="font-bold text-gray-900 text-lg mb-2">Tier-Based Limitations</div>
                <div className="text-gray-600 leading-relaxed">
                  Automatic gear restrictions for T0/T1 players - only weapon and armor included
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div className="font-bold text-gray-900 text-lg mb-2">Smart Item Tracking</div>
                <div className="text-gray-600 leading-relaxed">
                  Automatic calculation and aggregation of total items needed across all players
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="font-bold text-gray-900 text-lg mb-2">Data Persistence</div>
                <div className="text-gray-600 leading-relaxed">
                  Save, view, and modify regear threads with full edit capabilities anytime
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-3xl font-bold mb-2">4</div>
              <div className="text-blue-100">Role Types</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-3xl font-bold mb-2">4</div>
              <div className="text-purple-100">Tier Levels</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-emerald-100">Gear Presets</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};