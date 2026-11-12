

const usuarios = [
    { 
        id: 2, 
        nombre: "Susana", 
        email: "admin@pizzeria.com",
        password: "qwe1234"
    },
     { 
        id: 3, 
        nombre: "Chef Principal",
        email: "chef@pizzeria.com",
        password: "chefsito123"
    }
];

function obtenerTodos() {
  return usuarios;
}

function obtenerPorId(id) {
  for (usuario in usuarios) {
    console.log(usuario);
    if ((usuario.id = id)) {
      return usuarios[usuario];
    }
  }
  return false;
}

function actualizarUsuario(id, info) {
  usuario = obtenerPorId(id);
  if (!usuario) return false;
  Object.assign (usuario, info);
  return usuario;
}

function crear(datos) {
  const nuevoUsuario = {
    id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
    nombre: datos.nombre,
    email: datos.email,
    password: datos.password || "123456"
  };
  usuarios.push(nuevoUsuario);
  return nuevoUsuario;
}

function eliminar(id) {
  const indice = usuarios.findIndex(usuario => usuario.id == id);
  if (indice === -1) {
    return false;
  }
  usuarios.splice(indice, 1);
  return true;
}

module.exports = {
  actualizarUsuario,
  obtenerTodos,
  obtenerPorId,
  crear,
  eliminar
};