import { DashboardContext } from "../hooks/useDashBoard";
import type { DarkModeProviderProps } from "../type/DarkModeContextType";
import { Activity, Book, MapPin, NotebookPen } from "lucide-react";
import { db as peopleDB, type Person } from "../Database/peopleDB";
import { db as placeDB, type Place } from "../Database/placesDB";
import { db as noteDB } from "../Database/db";
import { db as journalDB, type JournalEntry } from "../Database/journalDB";
import { useEffect, useState } from "react";
import type { ActivityItem } from "../type/DashboardType";
import { liveQuery } from "dexie";
import type { Note } from "../type/NoteType";

interface ActivityCardItem {
  id: number | string;
  title: string;
  createdAt: string;
}

type DashboardSnapshot = {
  counts: {
    people: number;
    places: number;
    notes: number;
    journals: number;
  };
  activities: ActivityItem[];
  recentPeople: Person[];
  recentPlaces: Place[];
  recentNotes: Note[];
  recentJournals: JournalEntry[];
};

export function DashboardProvider({ children }: DarkModeProviderProps) {
  
  const [recentNotes, setRecentNotes] = useState<ActivityCardItem[]>([]);
  const [recentPeople, setRecentPeople] = useState<ActivityCardItem[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<ActivityCardItem[]>([]);
  const [recentJournals, setRecentJournals] = useState<ActivityCardItem[]>([]);

  const [counts, setCounts] = useState({
    people: 0,
    places: 0,
    notes: 0,
    journals: 0,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Define the observable using Dexie liveQuery
    const observable = liveQuery<DashboardSnapshot>(() => {
      // Counts
      const peopleCount = peopleDB.people.count();
      const placesCount = placeDB.places.count();
      const notesCount = noteDB.notes.count();
      const journalsCount = journalDB.journal.count();

      // Recent items
      const recentPeopleP = peopleDB.people
        .orderBy("createdAt")
        .reverse()
        .limit(3)
        .toArray();

      const recentPlacesP = placeDB.places
        .orderBy("createdAt")
        .reverse()
        .limit(3)
        .toArray();

      const recentNotesP = noteDB.notes
        .orderBy("createdAt")
        .reverse()
        .limit(3)
        .toArray();

      const recentJournalsP = journalDB.journal
        .orderBy("createdAt")
        .reverse()
        .limit(3)
        .toArray();

      // Aggregate in a single Promise.all to align with TS types
      return Promise.all([
        peopleCount,
        placesCount,
        notesCount,
        journalsCount,
        recentPeopleP,
        recentPlacesP,
        recentNotesP,
        recentJournalsP,
      ]).then(
        ([
          pCount,
          plCount,
          nCount,
          jCount,
          recentPeople,
          recentPlaces,
          recentNotes,
          recentJournals,
        ]) => {
          const combined: ActivityItem[] = [
            ...(recentPeople ?? []).map(
              (p): ActivityItem => ({
                id: Number(p.id),
                type: "people",
                title: p.name ?? "Unknown",
                createdAt: p.createdAt,
              })
            ),
            ...(recentPlaces ?? []).map(
              (p): ActivityItem => ({
                id: Number(p.id),
                type: "places",
                title: p.name ?? "Unknown",
                createdAt: p.createdAt,
              })
            ),
            ...(recentNotes ?? []).map(
              (n): ActivityItem => ({
                id: Number(n.id),
                type: "notes",
                title: n.title ?? "Untitled",
                createdAt: n.createdAt,
              })
            ),
            ...(recentJournals ?? []).map(
              (j): ActivityItem => ({
                id: Number(j.id),
                type: "journals",
                title: j.mood ?? "No mood",
                createdAt: j.createdAt,
              })
            ),
          ].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          return {
            counts: {
              people: pCount,
              places: plCount,
              notes: nCount,
              journals: jCount,
            },
            activities: combined.slice(0, 6),
            recentPeople,
            recentPlaces,
            recentNotes,
            recentJournals,
          } as DashboardSnapshot;
        }
      );
    });

    const subscription = observable.subscribe({
      next: (snapshot) => {
        setCounts(snapshot.counts);
        setActivities(snapshot.activities);
        setRecentJournals(snapshot.recentJournals
          .map((j) => ({
            id: String(j.id),
            title: j.mood ?? "No mood",
            createdAt: j.createdAt,
          })));
        setRecentNotes(
          snapshot.recentNotes.map((n) => ({
            id: String(n.id),
            title: n.title ?? "Untitled",
            createdAt: n.createdAt,
          }))
        );
        setRecentPeople(
       snapshot.recentPeople.map((p) => ({
            id: String(p.id),
            title: p.name ?? "Unknown",
            createdAt: p.createdAt,
          })  )
        );
        setRecentPlaces(
          snapshot.recentPlaces.map((p) => ({
            id: String(p.id),
            title: p.name ?? "Unknown",
            createdAt: p.createdAt,
          }))
        );
      },
      error: (err) => {
        console.error("Live query error:", err);
      },
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Build your stats array (unchanged)
  const stats = [
    {
      title: "People",
      value: counts.people,
      icon: <Activity className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      bg: "bg-blue-100 dark:bg-blue-950/40",
    },
    {
      title: "Places",
      value: counts.places,
      icon: <MapPin className="w-6 h-6 text-green-500 dark:text-green-400" />,
      bg: "bg-green-100 dark:bg-green-950/40",
    },
    {
      title: "Notes",
      value: counts.notes,
      icon: (
        <NotebookPen className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
      ),
      bg: "bg-yellow-100 dark:bg-yellow-950/40",
    },
    {
      title: "Journals",
      value: counts.journals,
      icon: <Book className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
      bg: "bg-purple-100 dark:bg-purple-950/40",
    },
  ];

  return (
    <DashboardContext.Provider value={{ stats, activities, recentNotes, recentPeople, recentPlaces, recentJournals }}>
      {children}
    </DashboardContext.Provider>
  );
}  