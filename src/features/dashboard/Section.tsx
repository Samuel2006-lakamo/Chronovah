import ItemCard from "./ItemCard";

function Section({
    title,
    items, }: {
    title: string;
    items: { id: number | string; title: string; createdAt: string }[];
  }) {
  return (
   <div className="space-y-3">
     <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
       {title}
     </h2>

     {items.length > 0 ? (
       <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 gap-3">
         {items.map((item) => (
           <ItemCard key={item.id} title={item.title} date={item.createdAt} />
         ))}
       </div>
     ) : (
       <p className="text-gray-500 dark:text-gray-400 text-sm italic">
         No {title.toLowerCase()} found.
       </p>
     )}
   </div>
  );
}

export default Section;

 