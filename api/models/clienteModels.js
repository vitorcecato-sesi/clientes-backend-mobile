//cliente.js 
const sqlite3 = require('sqlite3').verbose();
const dbPath = './infra/database.db';
// Função para abrir conexão com o banco de dados 
function openDbConnection() {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Erro ao abrir o banco de dados:', err.message);
        }
    });
    return db;
}
// Função para buscar todos os clientes 
function getAllClientes(callback) {
    const db = openDbConnection();
    db.all("SELECT * FROM clientes", [], (err, rows) => {
        db.close();
        callback(err, rows);
    });
}
// Função para buscar um cliente por ID 
function getClienteById(id, callback) {
    const db = openDbConnection();
    db.get("SELECT * FROM clientes WHERE id = ?", [id], (err, row) => {
        db.close();
        callback(err, row);
    });
}
// Função para criar um novo cliente 
function createCliente(cliente, callback) {
    const { nome, cpf, email, telefone } = cliente;
    const db = openDbConnection();
    db.run("INSERT INTO clientes (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)", [nome, cpf, email, telefone], function (err) {
        db.close();
        callback(err, { id: this.lastID });
    });
}
// Função para atualizar um cliente existente  
function updateCliente(id, cliente, callback) {
    const fields = [];
    const values = [];

    if (cliente.nome) {
        fields.push("nome = ?");
        values.push(cliente.nome);
    }
    if (cliente.cpf) {
        fields.push("cpf = ?");
        values.push(cliente.cpf);
    }
    if (cliente.email) {
        fields.push("email = ?");
        values.push(cliente.email);
    }
    if (cliente.telefone) {
        fields.push("telefone = ?");
        values.push(cliente.telefone);
    }

    if (fields.length === 0) {
        // Nada para atualizar
        return callback(null, { changes: 0 });
    }

    const db = openDbConnection();
    const comando = `UPDATE clientes SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    db.run(comando, values, function (err) {
        db.close();
        callback(err, { changes: this.changes });
    });
}
// Função para deletar um cliente 
function deleteCliente(id, callback) {
    const db = openDbConnection();
    db.run("DELETE FROM clientes WHERE id = ?", [id], function (err) {
        db.close();
        callback(err, { changes: this.changes });
    });
}
module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};
