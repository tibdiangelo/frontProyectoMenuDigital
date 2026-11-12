const express =require ("express");
const cors = require ("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send ('servidor del menú digital funcionando correctamente');
});

// Menú completo: 4 pizzas y 3 sodas
app.get('/api/menu', (req, res) => {
    res.json([
        // Las 4 Pizzas
        { id: 1, nombre: 'Pizza Hawaiana (Mediana)', precio: 35000 },
        { id: 2, nombre: 'Pizza pepperoni (Mediana)', precio: 35000 },
        { id: 3, nombre: 'Pizza jamon y queso (Mediana)', precio: 35000 },
        { id: 4, nombre: 'Pizza napolitana (Mediana)', precio: 350000 },
        
        // Las 3 Sodas
        { id: 5, nombre: 'Soda de Maracuyá', precio: 9000 },
        { id: 6, nombre: 'Soda de Frutos Rojos', precio: 9000 },
        { id: 7, nombre: 'Soda de Mango', precio: 9000 }
    ]);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); 
});