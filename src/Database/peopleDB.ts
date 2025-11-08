import Dexie, { type Table } from "dexie";

export interface Person {
  id?: number;
  name: string;
  description: string;
  image?: string;
  relation: string;
  createdAt: string;
}

const db = new Dexie("PeopleDatabase") as Dexie & {
  people: Table<Person, number>;
};

db.version(1).stores({
  people: "++id, name, description,relation, image, createdAt",
});

export { db };
