import React, { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import GlobalSearchItem from "./GlobalSearchItem";
import { highlight } from "../utils/hightlight";

import { db as peopleDB } from "../Database/peopleDB";
import { db as placeDB } from "../Database/placesDB";
import { db as notesDB } from "../Database/db";
import { db as journalDB } from "../Database/journalDB";
import SearchInput from "./SearchInput";
import { useSearch } from "../hooks/useSearch";

interface GlobalSearchProps {
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
const { query } = useSearch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      runSearch(query);
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Search function
  const runSearch = async (text: string) => {
    if (!text.trim()) return setResults([]);

    const lower = text.toLowerCase();

    const [people, places, notes, journals] = await Promise.all([
      peopleDB.people
        .filter((p) => p.name.toLowerCase().includes(lower))
        .toArray(),
      placeDB.places
        .filter((p) => p.name.toLowerCase().includes(lower))
        .toArray(),
      notesDB.notes
        .filter((n) => n.title.toLowerCase().includes(lower))
        .toArray(),
      journalDB.journal
        .filter((j) => j.mood.toLowerCase().includes(lower))
        .toArray(),
    ]);

    const mapped = [
      ...people.map((p) => ({
        type: "People",
        label: p.name,
        highlighted: highlight(p.name, text),
        id: p.id,
      })),
      ...places.map((p) => ({
        type: "Places",
        label: p.name,
        highlighted: highlight(p.name, text),
        id: p.id,
      })),
      ...notes.map((n) => ({
        type: "Notes",
        label: n.title,
        highlighted: highlight(n.title, text),
        id: n.id,
      })),
      ...journals.map((j) => ({
        type: "Journals",
        label: j.mood,
        highlighted: highlight(j.mood, text),
        id: j.id,
      })),
    ];

    setResults(mapped);
    setActiveIndex(0);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openItem = (item: any) => {
    if (item.type === "People") navigate(`/item/people/${item.id}`);
    if (item.type === "Places") navigate(`/item/places/${item.id}`);
    if (item.type === "Notes") navigate(`/item/notes/${item.id}`);
    if (item.type === "Journals") navigate(`/item/journals/${item.id}`);
    onClose();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    }

    if (e.key === "Enter" && results[activeIndex]) {
      openItem(results[activeIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 mt-15 flex p-4">
      <div
        ref={modalRef}
        className="w-full max-w-xl mx-auto h-fit bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}

        <SearchInput onClose={onClose} />

        {/* Results */}
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
          {results.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No results</p>
          ) : (
            results.map((item, i) => (
              <GlobalSearchItem
                key={i}
                item={item}
                isActive={i === activeIndex}
                onClick={() => openItem(item)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
