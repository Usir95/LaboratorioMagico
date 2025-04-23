import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { defineStore } from 'pinia';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db: any = null;

export const useDBStore = defineStore('database', () => {
  const initDB = async () => {
    if (db) return db;

    if (typeof window !== 'undefined' && Capacitor.getPlatform() == 'web') {
      console.info('[SQLite] Usando jeep-sqlite en el navegador.');
      
      const sqliteElement = document.querySelector('jeep-sqlite');
      if (!sqliteElement) {
        console.warn('[SQLite] El componente jeep-sqlite no está presente en el DOM.');
        return {
          query: async () => ({ values: [] }),
          run: async () => {},
          execute: async () => {},
        };
      }
      await customElements.whenDefined('jeep-sqlite');
    }

    const conn = await sqlite.createConnection('laboratorio', false, 'no-encryption', 1, false);
    await conn.open();
    db = conn;

    await db.execute(`
      CREATE TABLE IF NOT EXISTS ingredientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        tipo TEXT NOT NULL,
        rareza TEXT NOT NULL,
        imagen TEXT
      )
    `);

    return db;
  };

  const getDB = () => {
    if (!db) throw new Error("DB no inicializada");
    return db;
  };

  return { initDB, getDB };
});
