
type Heading = {
    heading:string
}

function CommonPageHeader({ heading }: Heading) {
     const todaysDate = new Date().toLocaleDateString(undefined, {
       weekday: "long",
       year: "numeric",
       month: "short",
       day: "numeric",
     });
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {heading}
      </h2>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {todaysDate}
      </span>
    </div>
  );
}

export default CommonPageHeader;