import {
  enablePromise,
  openDatabase,
} from "react-native-sqlite-storage"

// Enable promise for SQLite
enablePromise(true)

export const connectToDatabase = async () => {
  return openDatabase(
    { name: "LocalDb.db", location: "default" },
    () => {},
    (error) => {
      console.error(error)
      throw Error("Could not connect to database")
    }
  )
}

export const createTables = async (db) => {
  const UserQuery = `
    CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
        
    );
  `
  try {
    await db.executeSql(UserQuery)
  } catch (error) {
    console.error(error)
    throw Error(`Failed to create tables`)
  }
}

export const insertUser = async (name, age) => {
  const db = await connectToDatabase();
  await db.executeSql('INSERT INTO User (name, age) VALUES (?, ?);', [name, age]);
};


export const getUsers = async () => {
  const db = await connectToDatabase();
  const [results] = await db.executeSql('SELECT * FROM User;');
  const users = [];
  for (let i = 0; i < results.rows.length; i++) {
    users.push(results.rows.item(i));
  }
  return users;

};

export const deleteUser = async (id) => {
  const db = await connectToDatabase();
  await db.executeSql('DELETE FROM User WHERE id = ?;', [id]);
};


export const updateUser = async (id, name, age) => {
  const db = await connectToDatabase();
  await db.executeSql('UPDATE User SET name = ?, age = ? WHERE id = ?;', [name, age, id]);
};

