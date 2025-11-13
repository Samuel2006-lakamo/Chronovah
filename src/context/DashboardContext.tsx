import { DashboardContext } from "../hooks/useDashBoard";
import type { DarkModeProviderProps } from "../type/DarkModeContextType";
import { Activity, Book, MapPin, NotebookPen } from "lucide-react";
import { db as peopleDB } from "../Database/peopleDB";
import { db as placeDB } from "../Database/placesDB";
import { db as noteDB } from "../Database/db";
import { db as journalDB } from "../Database/journalDB";
import { useEffect, useState } from "react";
import type { ActivityItem } from "../type/DashboardType";





export function DashboardProvider({ children }: DarkModeProviderProps) {
    const [counts, setCounts] = useState({
      people: 0,
      places: 0,
      notes: 0,
      journals: 0,
    });
     const [activities, setActivities] = useState<ActivityItem[]>([]);

     useEffect(() => {
       const fetchData = async () => {
         try {
           // Counts
           const [peopleCount, placesCount, notesCount, journalsCount] =
             await Promise.all([
               peopleDB.people.count(),
               placeDB.places.count(),
               noteDB.notes.count(),
               journalDB.journal.count(),
             ]);

           setCounts({
             people: peopleCount,
             places: placesCount,
             notes: notesCount,
             journals: journalsCount,
           });

           // Recent items from each table
           const [recentPeople, recentPlaces, recentNotes, recentJournals] =
             await Promise.all([
               peopleDB.people
                 .orderBy("createdAt")
                 .reverse()
                 .limit(3)
                 .toArray(),
               placeDB.places.orderBy("createdAt").reverse().limit(3).toArray(),
               noteDB.notes.orderBy("createdAt").reverse().limit(3).toArray(),
               journalDB.journal
                 .orderBy("createdAt")
                 .reverse()
                 .limit(3)
                 .toArray(),
             ]);

           const combined: ActivityItem[] = [
             ...(recentPeople ?? []).map(
               (p): ActivityItem => ({
                 id: String(p.id),
                 type: "people",
                 title: p.name ?? "Unknown",
                 createdAt: p.createdAt,
               })
             ),
             ...(recentPlaces ?? []).map(
               (p): ActivityItem => ({
                 id: String(p.id),
                 type: "places",
                 title: p.name ?? "Unknown",
                 createdAt: p.createdAt,
               })
             ),
             ...(recentNotes ?? []).map(
               (n): ActivityItem => ({
                 id: String(n.id),
                 type: "notes",
                 title: n.title ?? "Untitled",
                 createdAt: n.createdAt,
               })
             ),
             ...(recentJournals ?? []).map(
               (j): ActivityItem => ({
                 id: String(j.id),
                 type: "journals",
                 title: j.mood ?? "No mood",
                 createdAt: j.createdAt,
               })
             ),
           ].sort(
             (a, b) =>
               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
           );
         

           setActivities(combined.slice(0, 6)); // show top 6 recent
         } catch (error) {
           console.error("Error fetching dashboard data:", error);
         }
       };

       fetchData();
     }, []);


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
      <DashboardContext.Provider value={{stats,activities}}>{children}</DashboardContext.Provider>
    );
}