import { Thread, ItemCount, GearPreset } from '../types';

export const calculateItemTotals = (thread: Thread): ItemCount => {
  const itemCounts: ItemCount = {};

  const addItems = (gear: GearPreset) => {
    Object.values(gear).forEach(item => {
      if (item && item.trim()) {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      }
    });
  };

  Object.values(thread.roles).forEach(players => {
    players.forEach(player => {
      for (let i = 0; i < player.quantity; i++) {
        addItems(player.selectedGear);
      }
    });
  });

  return itemCounts;
};

export const getTierLimitedGear = (fullGear: GearPreset, tier: number, role: string): GearPreset => {
  if (tier === 1) {
    // T1: Tank/Support/Healer get weapon + armor, DPS gets weapon only
    if (role === 'dps') {
      return {
        weapon: fullGear.weapon,
        headgear: '',
        armor: '',
        boots: '',
        ...(fullGear.offhand && { offhand: fullGear.offhand })
      };
    } else {
      return {
        weapon: fullGear.weapon,
        headgear: '',
        armor: fullGear.armor,
        boots: '',
        ...(fullGear.offhand && { offhand: fullGear.offhand })
      };
    }
  }
  
  if (tier === 2) {
    // T2: Tank/Support/Healer get weapon + armor + boots, DPS gets weapon + armor
    if (role === 'dps') {
      return {
        weapon: fullGear.weapon,
        headgear: '',
        armor: fullGear.armor,
        boots: '',
        ...(fullGear.offhand && { offhand: fullGear.offhand })
      };
    } else {
      return {
        weapon: fullGear.weapon,
        headgear: '',
        armor: fullGear.armor,
        boots: fullGear.boots,
        ...(fullGear.offhand && { offhand: fullGear.offhand })
      };
    }
  }
  
  // T3 and T4 get full regear
  if (tier === 3 || tier === 4) {
    return {
      ...fullGear
    };
  }
  
  return fullGear;
};