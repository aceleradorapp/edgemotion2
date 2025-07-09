import { EventDispatcher } from "../../Animjs.js";

class SQLite extends EventDispatcher {
  constructor(databaseName) {
    super();

    this.databaseName = databaseName;
    this.db = null;
    this.isOpen = false;

    this.open();
  }

  open() {
    if (this.isOpen) {
      return;
    }

    try {
      this.db = openDatabase(this.databaseName, '1.0', 'Database', 5 * 1024 * 1024);
      this.isOpen = true;
    } catch (error) {
      console.error(error);
    }
  }

  execute(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql, params, (_, { rowsAffected, insertId, rows }) => {
          resolve({ rowsAffected, insertId, rows });
        }, (_, error) => {
          reject(error);
        });
      });
    });
  }

  close() {
    if (!this.isOpen) {
      return;
    }

    this.db.close();
    this.isOpen = false;
  }
}

export default SQLite;

/*

import SQLite from './SQLite.js';

const db = new SQLite('meu_banco_de_dados');

// Criar tabela "usuarios"
db.execute('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nome TEXT)')
  .then(() => {
    console.log('Tabela criada com sucesso!');
    
    // Inserir um registro
    db.execute('INSERT INTO usuarios (nome) VALUES (?)', ['João'])
      .then(() => {
        console.log('Registro inserido com sucesso!');
        
        // Recuperar todos os registros
        db.execute('SELECT * FROM usuarios')
          .then(({ rows }) => {
            console.log('Registros encontrados:', rows);
            
            // Fechar conexão
            db.close();
          })
          .catch((error) => {
            console.error('Erro ao recuperar registros:', error);
          });
      })
      .catch((error) => {
        console.error('Erro ao inserir registro:', error);
      });
  })
  .catch((error) => {
    console.error('Erro ao criar tabela:', error);
  });


*/