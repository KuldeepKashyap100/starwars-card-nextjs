import {
  sqliteTable,
  text,
  integer,
  primaryKey
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(), // 'id' is the column name
  fullName: text("full_name")
});

export const favorites = sqliteTable(
  "favorites",
  {
    userId: integer("user_id").references(() => users.id),
    characterId: integer("character_id")
  },
  (table) => ({ pk: primaryKey(table.userId, table.characterId) })
);
