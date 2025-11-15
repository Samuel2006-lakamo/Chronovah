import Dexie, {  type Table } from "dexie";

export interface Place {
  id?: string;
  name: string;
  country: string;
  location: string;
  type: string;
  notes: string;
  image: string;  
  createdAt: string;
}

const db = new Dexie("PlacesDatabase") as Dexie & {
  places: Table  <Place, number>;
};

db.version(2).stores({
  places: "++id, name, country, location, type, createdAt",
});

export { db };
