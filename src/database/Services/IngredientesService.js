import { useDBStore } from '@/database/sqlite-store';

export const getIngredientes = async () => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();
    const res = await db.query("SELECT * FROM ingredientes ORDER BY nombre ASC");
    return res.values || [];
};

export const addIngrediente = async (ingrediente) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(
        `INSERT INTO ingredientes (nombre, tipo, rareza, imagen) VALUES (?, ?, ?, ?)`, 
        [ingrediente.nombre, ingrediente.tipo, ingrediente.rareza, ingrediente.imagen || null]
    );
};
