import { SQLiteDatabase } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Message, Role } from '@/app/utils/Interfaces';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  console.log(FileSystem.documentDirectory);

  const DATABASE_VERSION = 1;

  // Get user version of the database
  let result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  // Get the current version of the database
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    console.log('Database is up to date');

    return;
  }

  // If incorrect version, create tables
  if (currentDbVersion === 0) {
    const result = await db.execAsync(`
PRAGMA journal_mode = 'wal';

CREATE TABLE chats (
  id INTEGER PRIMARY KEY NOT NULL,
  title TEXT NOT NULL
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY NOT NULL,
  chat_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  imageUrl TEXT,
  role TEXT,
  prompt TEXT,
  FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
);
`);

    console.log(result);

    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

// Functions to interact with the database
export const addChat = async (db: SQLiteDatabase, title: string) => {
  return await db.runAsync('INSERT INTO chats (title) VALUES (?)', title);
};

export const getChats = async (db: SQLiteDatabase) => {
  return await db.getAllAsync('SELECT * FROM chats');
};

export const getMessages = async (db: SQLiteDatabase, chatId: number) => {
  return (
    await db.getAllAsync<Message>(
      'SELECT * FROM messages WHERE chat_id = ?',
      chatId
    )
  ).map((message) => ({
    ...message,
    role: `${message.role}` === 'bot' ? Role.Bot : Role.User,
  }));
};

export const addMessage = async (
  db: SQLiteDatabase,
  chatId: number,
  { content, role, imageUrl, prompt }: Message
) => {
  return await db.runAsync(
    'INSERT INTO messages (chat_id, content, role, imageUrl, prompt) VALUES (?, ?, ?, ?, ?)',
    chatId,
    content,
    role === Role.Bot ? 'bot' : 'user',
    imageUrl || '',
    prompt || ''
  );
};

export const renameChat = async (
  db: SQLiteDatabase,
  chatId: number,
  title: string
) => {
  return await db.runAsync(
    'UPDATE chats SET title = ? WHERE id = ?',
    title,
    chatId
  );
};

export const deleteChat = async (db: SQLiteDatabase, chatId: number) => {
  return await db.runAsync('DELETE FROM chats WHERE id = ?', chatId);
};
