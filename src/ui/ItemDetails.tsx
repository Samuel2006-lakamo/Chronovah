import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db as noteDB } from "../Database/db";
import { db as peopleDB, type Person } from "../Database/peopleDB";
import { db as placeDB, type Place } from "../Database/placesDB";
import { db as journalDB, type JournalEntry } from "../Database/journalDB";
import { ArrowLeft } from "lucide-react";
import type Dexie from "dexie";
import type { Note } from "../type/NoteType";
import { JournalCard } from "./JournalCard";
import { NotesCard } from "./NoteCard";
import { PlacesCard } from "./PlaceCard";
import { PeopleCard } from "./PeopleCard";



// DB_MAP maps type to the appropriate DB collection
const DB_MAP = {
  people: peopleDB.people,
  places: placeDB.places,
  notes: noteDB.notes,
  journals: journalDB.journal,
};

function ItemDetails() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<Person | Note | JournalEntry | Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
console.log('hello details');
  useEffect(() => {
    let isMounted = true;

    async function loadItem() {
      setLoading(true);
      setError(null);
      try {
        const table = DB_MAP[type as keyof typeof DB_MAP];
        if (!table) {
          throw new Error(`Invalid type: ${type}`);
        }
    const needsNumberId =
      type === "people" ||
      type === "places" ||
      type === "notes" ||
      type === "journals";

    const parsedId = needsNumberId ? Number(id) : id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await(table as Dexie.Table<any, any>).get(parsedId);

        if (isMounted) {
          setItem(data ?? null);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || "Unknown error");
          setItem(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [type, id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400 dark:text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button className="mt-3 btn btn-sm" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
    } 
    console.log("working...");
console.log(item);
  // Fallback if item not found
  if (!item) {
    return (
      <div className="p-6 mt-20 text-center">
        <p className="text-gray-400 dark:text-gray-500">Item not found.</p>
        <button className="mt-3 btn btn-sm" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 mt-15">
      <button
        className="flex items-center mb-4 gap-2 text-sm text-gray-700 dark:text-gray-300"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        Back
      </button>

          <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 shadow">
             <h1 className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">
          {type} Details
             </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Created: {new Date(item.createdAt).toLocaleString()}
        </p>

        {/* Render by Type */}
        <>
        
        {type === "people" && (
          <PeopleCard item={item as Person} />
        )}

        {type === "places" && (
          <PlacesCard item={item as Place} />
        )}

        {type === "notes" && (
          <NotesCard item={item as Note} />
        )}

        {type === "journals" && (
          <JournalCard item={item as JournalEntry} />
          )}
          </>
      </div>
      </div>
 
  );
}

export default ItemDetails;
