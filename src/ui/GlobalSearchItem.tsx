import React from "react";

interface ItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  isActive: boolean;
  onClick: () => void;
}

const GlobalSearchItem: React.FC<ItemProps> = ({ item, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl cursor-pointer border  border-gray-300 dark:border-white/10
      ${isActive ? "bg-white/10 border-blue-600 dark:bg-gray-900" : "hover:bg-gray/50"}
      transition`}
    >
      <p className="text-xs text-gray-400 mb-1">{item.type}</p>

      <p
        className="text-sm font-medium dark:text-white"
        dangerouslySetInnerHTML={{ __html: item.highlighted }}
      />
    </div>
  );
};

export default GlobalSearchItem;
