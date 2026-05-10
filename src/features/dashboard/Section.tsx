import { useNavigate } from "react-router-dom";
import ItemCard from "./ItemCard";

const SECTION_ROUTES: Record<string, string> = {
  "Recent Notes":    "/notes",
  "Recent People":   "/people",
  "Recent Places":   "/places",
  "Recent Journals": "/journal",
};

interface SectionItem {
  id: number | string;
  item: string;
  title: string;
  createdAt: string;
}

function Section({ title, items }: { title: string; items: SectionItem[] }) {
  const navigate = useNavigate();
  const route = SECTION_ROUTES[title];

  return (
    <section aria-label={title}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-sm sm:text-base font-semibold text-primary">{title}</h2>
        {route && (
          <button
            onClick={() => navigate(route)}
            className="text-xs text-primary-500 hover:text-primary-600 transition-colors font-medium"
          >
            View all
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {items.map((item) => (
            <ItemCard
              key={`${item.item}-${item.id}`}
              item={item.item}
              title={item.title}
              date={item.createdAt}
              id={item.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-default rounded-xl px-3 sm:px-4 py-4 sm:py-6 text-center">
          <p className="text-xs sm:text-sm text-muted">
            No {title.replace("Recent ", "").toLowerCase()} yet.
          </p>
          {route && (
            <button
              onClick={() => navigate(route)}
              className="mt-2 text-xs text-primary-500 hover:text-primary-600 transition-colors"
            >
              Create one
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default Section;
