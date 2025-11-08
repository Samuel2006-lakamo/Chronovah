import { db } from "../../Database/peopleDB";
import { type PersonCardProps } from "../../type/PeopleType";
function Person({ person, setPreview }: PersonCardProps) {
    
     const deletePerson = async (id?: number) => {
       if (!id) return;
       await db.people.delete(id);
     };
  return (
    <div
      className="bg-white dark:bg-[#0B1120] p-4 rounded-lg shadow hover:shadow-md transition relative"
    >
      {person.image && (
        <img
          src={person.image}
          alt={person.name}
          onClick={() => setPreview(person.image!)}
          className="w-full h-40 object-cover rounded-md mb-3 cursor-pointer hover:opacity-90 transition"
        />
      )}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
        {person.name}
      </h3>
      <p className="text-sm text-blue-500 mb-1 font-medium">
        {person.relation}
      </p>
      <p className="text-gray-600 dark:text-gray-300 text-sm wrap-break-word whitespace-pre-wrap">
        {person.description}
      </p>
      <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>{new Date(person.createdAt).toLocaleDateString()}</span>
        <button
          onClick={() => deletePerson(person.id)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Person;