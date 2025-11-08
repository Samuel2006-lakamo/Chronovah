import { useState } from "react";
import { db } from "../../Database/peopleDB";

function PeopleInput() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [relation, setRelation] = useState("");
  const [image, setImage] = useState<string | null>(null);
     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (!file) return;

       const reader = new FileReader();
       reader.onload = () => setImage(reader.result as string);
       reader.readAsDataURL(file);
     };

     const addPerson = async () => {
       if (!name.trim() || !description.trim() || !relation.trim()) return;
       await db.people.add({
         name,
         description,
         relation,
         image: image || "",
         createdAt: new Date().toISOString(),
       });
       setName("");
       setDescription("");
       setRelation("");
       setImage(null);
     };
  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-lg p-4 shadow mb-8">
      <input
        type="text"
        placeholder="Person's name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-3 p-2 rounded-md bg-gray-50 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Write something about this person..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full mb-3 p-2 rounded-md bg-gray-50 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={relation}
        onChange={(e) => setRelation(e.target.value)}
        className="w-full mb-3 p-2 rounded-md bg-gray-50 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Relation</option>
        <option value="Friend">Friend</option>
        <option value="Friend">Lovers</option>
        <option value="Family">Family</option>
        <option value="Coworker">Coworker</option>
        <option value="Partner">Partner</option>
        <option value="Other">Other</option>
      </select>
      <div className="flex items-center justify-between">
        <label className="cursor-pointer text-sm text-blue-500 hover:underline">
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
        <button
          onClick={addPerson}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>
      {image && (
        <img
          src={image}
          alt="Preview"
          className="mt-3 w-20 h-20 object-cover rounded-md border border-gray-300 dark:border-gray-700"
        />
      )}
    </div>
  );
}

export default PeopleInput;