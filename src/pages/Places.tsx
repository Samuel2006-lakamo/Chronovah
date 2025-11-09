import { useState } from "react";
import { db } from "../Database/placesDB";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";

function Places() {
  const places = useLiveQuery(() => db.places.toArray(), []) || [];

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<number | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addOrUpdatePlace = async () => {
    if (!name.trim() || !country.trim() || !location.trim()) return;

    const placeData = {
      name,
      country,
      location,
      type,
      notes,
      image: image || "",
      createdAt: new Date().toISOString(),
    };

    if (editing) {
      await db.places.update(editing, placeData);
      setEditing(null);
    } else {
      await db.places.add({ id: nanoid(), ...placeData });
    }

    setName("");
    setCountry("");
    setLocation("");
    setType("");
    setNotes("");
    setImage(null);
  };

  const deletePlace = async (id: number) => {
    await db.places.delete(id);
  };

  const editPlace = (place: any) => {
    setEditing(place.id);
    setName(place.name);
    setCountry(place.country);
    setLocation(place.location);
    setType(place.type);
    setNotes(place.notes);
    setImage(place.image);
  };

  return (
    <div className="p-4 sm:p-6 mt-20 pb-28 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Places
      </h2>

      {/* Form */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Place name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] 
                     text-gray-800 dark:text-gray-100 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] 
                     text-gray-800 dark:text-gray-100 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Location / Address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] 
                     text-gray-800 dark:text-gray-100 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] 
                     text-gray-800 dark:text-gray-100 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select type</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Park">Park</option>
          <option value="Beach">Beach</option>
          <option value="Museum">Museum</option>
          <option value="Mall">Mall</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          placeholder="Notes about the place..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] 
                     text-gray-800 dark:text-gray-100 sm:col-span-2 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="sm:col-span-2 text-gray-800 dark:text-gray-100"
        />
        <button
          onClick={addOrUpdatePlace}
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 sm:col-span-2"
        >
          {editing ? "Save Changes" : "Add Place"}
        </button>
      </div>

      {/* Places grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-white dark:bg-[#0B1120] p-4 rounded-lg shadow hover:shadow-md transition relative"
          >
            {place.image && (
              <img
                src={place.image}
                alt={place.name}
                onClick={() => setPreview(place.image!)}
                className="w-full h-40 object-cover rounded-md mb-2 cursor-pointer"
              />
            )}
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              {place.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              🌍 {place.country}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📍 {place.location}
            </p>
            {place.type && (
              <span className="text-xs text-blue-500 font-medium">
                #{place.type}
              </span>
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3 break-words">
              {place.notes || "No additional notes..."}
            </p>

            {/* Edit / Delete Buttons */}
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => editPlace(place)}
                className="text-sm px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => deletePlace(place.id!)}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="Preview"
            className="max-w-[90%] max-h-[80%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default Places;
