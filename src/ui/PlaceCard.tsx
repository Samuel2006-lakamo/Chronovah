
import type { Place } from "../Database/placesDB";

export function PlacesCard({ item }: { item: Place }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {item.name}
      </h2>

      {item.location && (
        <p className="text-gray-600 dark:text-gray-400">{item.location}</p>
      )}

      {item.country && (
        <p className="text-gray-500 dark:text-gray-400">
          Country: {item.country}
        </p>
      )}
    </div>
  );
}
