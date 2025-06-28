import { Filter, X } from "lucide-react";

interface FilterOption {
  key: string;
  label: string;
  color: string;
}

interface FilterBadgesProps {
  productId: string;
  activeFilter: string | null;
  onToggleFilter: (filterKey: string | null) => void;
}

const filterOptions: FilterOption[] = [
  {
    key: "good",
    label: "تجربیات خوب",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  {
    key: "bad",
    label: "تجربیات بد",
    color: "bg-red-100 text-red-800 hover:bg-red-200",
  }
];

const FilterBadges = ({ activeFilter, onToggleFilter }: FilterBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Filter className="w-4 h-4" />
        فیلتر نظرات:
      </div>
      {filterOptions.map((option) => (
        <span
          key={option.key}
          className={`px-2 py-1 text-xs rounded-full cursor-pointer transition-colors ${
            activeFilter === option.key
              ? option.color
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => onToggleFilter(option.key)}
        >
          {option.label}
        </span>
      ))}
      {activeFilter && (
        <span
          className="px-2 py-1 text-xs rounded-full border text-black border-gray-300 bg-white cursor-pointer hover:bg-gray-100 flex items-center gap-1"
          onClick={() => onToggleFilter(null)}
        >
          <X className="w-3 h-3" />
          حذف فیلتر
        </span>
      )}
    </div>
  );
};

export default FilterBadges;
