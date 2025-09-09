export interface GearPreset {
  weapon: string;
  offhand?: string;
  headgear: string;
  armor: string;
  boots: string;
}

export interface Player {
  ign: string;
  tier: number;
  selectedGear: GearPreset;
  quantity: number;
}

export interface Thread {
  id: string;
  utcDate: string;
  contentName: string;
  roles: {
    tank: Player[];
    dps: Player[];
    support: Player[];
    healer: Player[];
  };
  createdAt: Date;
  lastModified: Date;
}

export type RoleType = 'tank' | 'dps' | 'support' | 'healer';

export type MemberRole = 'tank' | 'dps' | 'support' | 'healer' | 'villager' | 'bsquad';

export interface MemberData {
  name: string;
  id: string;
  guildName: string;
  role: MemberRole;
  tier: number;
}

export interface ItemCount {
  [itemName: string]: number;
}
