import { useDBStore } from '@/database/sqlite-store';

// export const GetIngredientes = async () => {
//     const dbStore = useDBStore();
//     const db = await dbStore.initDB();
//     const res = await db.query("SELECT * FROM ingredientes ORDER BY nombre ASC");
//     return res.values || [];
// };

export const GetIngredientes = async () => {
    return [
        { id: 1, nombre: 'Zanahoria', tipo: 'Vegetal', rareza: 'Común', imagen: null },
        { id: 2, nombre: 'Manzana', tipo: 'Fruta', rareza: 'Común', imagen: null },
        { id: 3, nombre: 'Trufa', tipo: 'Hongo', rareza: 'Rara', imagen: null },
        { id: 4, nombre: 'Pescado', tipo: 'Proteína', rareza: 'Común', imagen: null },
        { id: 5, nombre: 'Pimienta', tipo: 'Especia', rareza: 'Poco común', imagen: null }
    ];
};

export const AddIngredientes = async (ingrediente) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(
        `INSERT INTO ingredientes (nombre, tipo, rareza, descripcion, imagen) VALUES (?, ?, ?, ?)`, 
        [ingrediente.nombre, ingrediente.tipo, ingrediente.rareza, ingrediente.imagen || null]
    );
};


export const updateIngrediente = async (ingrediente) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(`UPDATE ingredientes SET nombre = ?, tipo = ?, rareza = ?, descripcion = ?, imagen = ? WHERE id = ?`,
        [ ingrediente.nombre, ingrediente.tipo, ingrediente.rareza, ingrediente.descripcion, ingrediente.imagen || null, ingrediente.id]
    );
};

export const deleteIngrediente = async (id) => {
    const dbStore = useDBStore();
    const db = await dbStore.initDB();

    await db.run(`DELETE FROM ingredientes WHERE id = ?`, [id]);
};
