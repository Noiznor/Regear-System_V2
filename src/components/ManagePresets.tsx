import React, { useState, useEffect } from 'react';
import { Shield, Sword, Heart, Star, Plus, Edit, Save, Trash2, X, Check } from 'lucide-react';
import { GearPreset, RoleType } from '../types';
import { loadCustomPresets, saveCustomPresets, getPresetsByRole } from '../data/gearPresets';

export const ManagePresets: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType>('tank');
  const [presets, setPresets] = useState<Record<string, GearPreset>>({});
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [editingPresetName, setEditingPresetName] = useState<string>('');
  const [newPresetName, setNewPresetName] = useState('');
  const [presetForm, setPresetForm] = useState<GearPreset>({
    weapon: '',
    headgear: '',
    armor: '',
    boots: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasOffhand, setHasOffhand] = useState(false);

  const roleConfig = {
    tank: { 
      icon: Shield, 
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    dps: { 
      icon: Sword, 
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      button: 'bg-red-600 hover:bg-red-700'
    },
    support: { 
      icon: Star, 
      gradient: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    healer: { 
      icon: Heart, 
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  useEffect(() => {
    loadPresetsForRole(selectedRole);
  }, [selectedRole]);

  const loadPresetsForRole = (role: RoleType) => {
    const rolePresets = getPresetsByRole(role);
    setPresets(rolePresets);
  };

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setEditingPreset(null);
    setShowAddForm(false);
    setNewPresetName('');
    resetForm();
  };

  const resetForm = () => {
    setPresetForm({
      weapon: '',
      headgear: '',
      armor: '',
      boots: ''
    });
  };

  const startEditing = (presetName: string) => {
    setEditingPreset(presetName);
    setEditingPresetName(presetName);
    setPresetForm({ ...presets[presetName] });
    setHasOffhand(!!presets[presetName].offhand);
    setShowAddForm(false);
  };

  const startAdding = () => {
    setShowAddForm(true);
    setEditingPreset(null);
    setEditingPresetName('');
    setNewPresetName('');
    setHasOffhand(false);
    resetForm();
  };

  const savePreset = () => {
    if (editingPreset) {
      // Update existing preset (handle name change)
      const updatedPresets = { ...presets };
      
      // If name changed, remove old entry and add new one
      if (editingPreset !== editingPresetName.trim()) {
        delete updatedPresets[editingPreset];
      }
      
      const finalPreset = { ...presetForm };
      if (!hasOffhand) {
        delete finalPreset.offhand;
      }
      
      updatedPresets[editingPresetName.trim()] = finalPreset;
      saveCustomPresets(selectedRole, updatedPresets);
      setPresets(updatedPresets);
      setEditingPreset(null);
      setEditingPresetName('');
    } else if (showAddForm && newPresetName.trim()) {
      // Add new preset
      const finalPreset = { ...presetForm };
      if (!hasOffhand) {
        delete finalPreset.offhand;
      }
      
      const updatedPresets = { ...presets, [newPresetName.trim()]: finalPreset };
      saveCustomPresets(selectedRole, updatedPresets);
      setPresets(updatedPresets);
      setShowAddForm(false);
      setNewPresetName('');
    }
    setHasOffhand(false);
    resetForm();
  };

  const deletePreset = (presetName: string) => {
    const updatedPresets = { ...presets };
    delete updatedPresets[presetName];
    saveCustomPresets(selectedRole, updatedPresets);
    setPresets(updatedPresets);
    if (editingPreset === presetName) {
      setEditingPreset(null);
      resetForm();
    }
  };

  const cancelEdit = () => {
    setEditingPreset(null);
    setEditingPresetName('');
    setShowAddForm(false);
    setNewPresetName('');
    setHasOffhand(false);
    resetForm();
  };

  const updatePresetField = (field: keyof GearPreset, value: string) => {
    setPresetForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleOffhand = () => {
    setHasOffhand(!hasOffhand);
    if (hasOffhand) {
      // Remove offhand from form when toggling off
      setPresetForm(prev => {
        const newForm = { ...prev };
        delete newForm.offhand;
        return newForm;
      });
    } else {
      // Add offhand field when toggling on
      setPresetForm(prev => ({ ...prev, offhand: '' }));
    }
  };
  const config = roleConfig[selectedRole];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Manage Gear Presets
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            View, add, modify, and delete gear presets for all roles. Changes are saved for all users.
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Role</h2>
            <p className="text-lg text-gray-600">Choose which role's presets you want to manage</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(['tank', 'dps', 'support', 'healer'] as RoleType[]).map(role => {
              const roleConf = roleConfig[role];
              const RoleIcon = roleConf.icon;
              const isSelected = selectedRole === role;
              const rolePresetCount = Object.keys(getPresetsByRole(role)).length;
              
              return (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`group relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${
                    isSelected 
                      ? `${roleConf.bg} ${roleConf.border} shadow-2xl` 
                      : 'bg-white/90 backdrop-blur-sm border-gray-200 hover:border-transparent hover:shadow-2xl'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${roleConf.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-300 ${isSelected ? 'opacity-10' : ''}`} />
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-br ${roleConf.gradient} rounded-2xl p-6 mx-auto mb-6 w-20 h-20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <RoleIcon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 capitalize">{role}</h3>
                    <div className="bg-gray-100 rounded-xl px-4 py-2">
                      <span className="text-sm font-bold text-gray-700">
                        {rolePresetCount} presets
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Presets Management */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <div className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-4 mr-4 shadow-2xl`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 capitalize">{selectedRole} Presets</h2>
                <p className="text-lg text-gray-600">{Object.keys(presets).length} presets available</p>
              </div>
            </div>
            
            <button
              onClick={startAdding}
              disabled={showAddForm || editingPreset !== null}
              className={`px-8 py-4 ${config.button} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center text-lg`}
            >
              <Plus className="mr-3 h-6 w-6" />
              Add New Preset
            </button>
          </div>

          {/* Add New Preset Form */}
          {showAddForm && (
            <div className={`${config.bg} rounded-3xl p-8 border-2 ${config.border} shadow-lg mb-8`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Preset</h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preset Name</label>
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                    placeholder="Enter preset name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Weapon</label>
                  <input
                    type="text"
                    value={presetForm.weapon}
                    onChange={(e) => updatePresetField('weapon', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                    placeholder="Weapon name"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-gray-700">Offhand Item</label>
                    <button
                      type="button"
                      onClick={toggleOffhand}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
                        hasOffhand
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      {hasOffhand ? 'Has Offhand' : 'No Offhand'}
                    </button>
                  </div>
                  {hasOffhand && (
                    <input
                      type="text"
                      value={presetForm.offhand || ''}
                      onChange={(e) => updatePresetField('offhand', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                      placeholder="Offhand item name"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Headgear</label>
                  <input
                    type="text"
                    value={presetForm.headgear}
                    onChange={(e) => updatePresetField('headgear', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                    placeholder="Headgear name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Armor</label>
                  <input
                    type="text"
                    value={presetForm.armor}
                    onChange={(e) => updatePresetField('armor', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                    placeholder="Armor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Boots</label>
                  <input
                    type="text"
                    value={presetForm.boots}
                    onChange={(e) => updatePresetField('boots', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                    placeholder="Boots name"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelEdit}
                  className="px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={savePreset}
                  disabled={!newPresetName.trim() || !presetForm.weapon.trim()}
                  className={`px-8 py-3 ${config.button} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center`}
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Preset
                </button>
              </div>
            </div>
          )}

          {/* Presets List */}
          <div className="space-y-6">
            {Object.keys(presets).length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-3xl p-8 mx-auto mb-6 w-24 h-24 flex items-center justify-center shadow-lg">
                  <Icon className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl font-medium">No presets available for {selectedRole}</p>
                <p className="text-gray-400 mt-2">Click "Add New Preset" to create your first preset</p>
              </div>
            ) : (
              Object.entries(presets).map(([presetName, preset]) => (
                <div key={presetName} className={`rounded-3xl p-8 border-2 shadow-lg transition-all duration-200 ${
                  editingPreset === presetName 
                    ? `${config.bg} ${config.border}` 
                    : 'bg-gray-50 border-gray-200 hover:shadow-xl'
                }`}>
                  {editingPreset === presetName ? (
                    // Edit Form
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Editing Preset</h3>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Preset Name</label>
                          <input
                            type="text"
                            value={editingPresetName}
                            onChange={(e) => setEditingPresetName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/90"
                            placeholder="Enter preset name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Weapon</label>
                          <input
                            type="text"
                            value={presetForm.weapon}
                            onChange={(e) => updatePresetField('weapon', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                            placeholder="Weapon name"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-gray-700">Offhand</label>
                            <button
                              type="button"
                              onClick={toggleOffhand}
                              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all duration-200 ${
                                hasOffhand
                                  ? 'bg-green-500 text-white hover:bg-green-600'
                                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                              }`}
                            >
                              {hasOffhand ? 'ON' : 'OFF'}
                            </button>
                          </div>
                          {hasOffhand ? (
                            <input
                              type="text"
                              value={presetForm.offhand || ''}
                              onChange={(e) => updatePresetField('offhand', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                              placeholder="Offhand item"
                            />
                          ) : (
                            <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500 text-center">
                              No offhand item
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Headgear</label>
                          <input
                            type="text"
                            value={presetForm.headgear}
                            onChange={(e) => updatePresetField('headgear', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                            placeholder="Headgear name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Armor</label>
                          <input
                            type="text"
                            value={presetForm.armor}
                            onChange={(e) => updatePresetField('armor', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                            placeholder="Armor name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Boots</label>
                          <input
                            type="text"
                            value={presetForm.boots}
                            onChange={(e) => updatePresetField('boots', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/90"
                            placeholder="Boots name"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={cancelEdit}
                          className="px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={savePreset}
                          disabled={!editingPresetName.trim() || !presetForm.weapon.trim()}
                          className={`px-8 py-3 ${config.button} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center`}
                        >
                          <Save className="mr-2 h-5 w-5" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">{presetName}</h3>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => startEditing(presetName)}
                            disabled={showAddForm || editingPreset !== null}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => deletePreset(presetName)}
                            disabled={showAddForm || editingPreset !== null}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="bg-white/90 rounded-xl p-4 shadow-sm">
                          <strong className="text-gray-700 text-sm">Weapon:</strong>
                          <div className="text-gray-900 font-bold">{preset.weapon || 'None'}</div>
                        </div>
                        
                        {preset.offhand !== undefined && (
                          <div className="bg-white/90 rounded-xl p-4 shadow-sm">
                            <strong className="text-gray-700 text-sm">Offhand:</strong>
                            <div className="text-gray-900 font-bold">{preset.offhand || 'None'}</div>
                          </div>
                        )}
                        
                        <div className="bg-white/90 rounded-xl p-4 shadow-sm">
                          <strong className="text-gray-700 text-sm">Headgear:</strong>
                          <div className="text-gray-900 font-bold">{preset.headgear || 'None'}</div>
                        </div>
                        
                        <div className="bg-white/90 rounded-xl p-4 shadow-sm">
                          <strong className="text-gray-700 text-sm">Armor:</strong>
                          <div className="text-gray-900 font-bold">{preset.armor || 'None'}</div>
                        </div>
                        
                        <div className="bg-white/90 rounded-xl p-4 shadow-sm">
                          <strong className="text-gray-700 text-sm">Boots:</strong>
                          <div className="text-gray-900 font-bold">{preset.boots || 'None'}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
