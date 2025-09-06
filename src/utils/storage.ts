import { Thread } from '../types';

const STORAGE_KEY = 'regear_threads';

export const saveThreads = (threads: Thread[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
};

export const loadThreads = (): Thread[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const threads = JSON.parse(stored);
    return threads.map((thread: any) => ({
      ...thread,
      contentName: thread.contentName || 'CASTLE',
      createdAt: new Date(thread.createdAt),
      lastModified: new Date(thread.lastModified),
      roles: {
        tank: thread.roles.tank.map((player: any) => ({ ...player, quantity: player.quantity || 1 })),
        dps: thread.roles.dps.map((player: any) => ({ ...player, quantity: player.quantity || 1 })),
        support: thread.roles.support.map((player: any) => ({ ...player, quantity: player.quantity || 1 })),
        healer: thread.roles.healer.map((player: any) => ({ ...player, quantity: player.quantity || 1 }))
      }
    }));
  } catch {
    return [];
  }
};

export const deleteThread = (threadId: string): void => {
  const threads = loadThreads();
  const updatedThreads = threads.filter(thread => thread.id !== threadId);
  saveThreads(updatedThreads);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
