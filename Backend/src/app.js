const express =require ("express");
const app = express ();
const PORT = 3000;
const mesaRutas =require( "../routers/mesa.rutas");
const pedidoRutas =require("../routers/pedido.ruta");
const usuarioRutas =require("../routers/usuario.ruta");

app.use (express.json());
app.use("/api/mesas",  mesaRutas);
app.use("/api/pedidos", pedidoRutas);
app.use("/api/usuarios", usuarioRutas)


app.get ("/", (req, res) => {
    res.send ("servidor del menu digital funcionando correctamente");
});
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
    console.log (`Servidor corriendo en http://localhost:${PORT}`);
});
