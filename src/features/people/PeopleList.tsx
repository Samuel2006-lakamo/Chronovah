import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../Database/peopleDB";
import Person from "./Person";

interface PeopleListProps {
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

function PeopleList({ setPreview }: PeopleListProps) {
  const people = useLiveQuery(() => db.people.toArray(), []) || [];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
      {people.length > 0 ? (
        people.map((person) => (
          <Person key={person.id} person={person} setPreview={setPreview} />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No people added yet.
        </p>
      )}
    </div>
  );
}

export default PeopleList;
