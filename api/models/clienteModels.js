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
    // Array para armazenar os campos que serão atualizados
    const fields = [];
    // Array para armazenar os valores correspondentes aos campos
    const values = [];

    // Verifica se o campo 'nome' foi fornecido e o adiciona para atualização
    if (cliente.nome) {
        fields.push("nome = ?");
        values.push(cliente.nome);
    }
    // Verifica se o campo 'cpf' foi fornecido e o adiciona para atualização
    if (cliente.cpf) {
        fields.push("cpf = ?");
        values.push(cliente.cpf);
    }
    // Verifica se o campo 'email' foi fornecido e o adiciona para atualização
    if (cliente.email) {
        fields.push("email = ?");
        values.push(cliente.email);
    }
    // Verifica se o campo 'telefone' foi fornecido e o adiciona para atualização
    if (cliente.telefone) {
        fields.push("telefone = ?");
        values.push(cliente.telefone);
    }

    // Se nenhum campo foi fornecido, retorna sem fazer alterações
    if (fields.length === 0) {
        return callback(null, { changes: 0 });
    }

    // Abre a conexão com o banco de dados
    const db = openDbConnection();
    // Monta a string de comando SQL para a atualização
    const comando = `UPDATE clientes SET ${fields.join(", ")} WHERE id = ?`;
    // Adiciona o ID do cliente ao final do array de valores
    values.push(id);

    // Executa o comando SQL de atualização
    db.run(comando, values, function (err) {
        db.close(); // Fecha a conexão com o banco de dados
        // Retorna o erro (se houver) e o número de linhas alteradas
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
