import PropTypes from 'prop-types';
import { Tag, Edit } from 'lucide-react';

export function ItemCard({ item, onEdit }) {
  // Determine color badge based on category
  const getCategoryColor = (cat) => {
    const colors = {
      'Fittings': 'bg-blue-100 text-blue-700',
      'Valves': 'bg-red-100 text-red-700',
      'Pipes': 'bg-green-100 text-green-700',
      'Faucets': 'bg-purple-100 text-purple-700',
      'Consumables': 'bg-orange-100 text-orange-700'
    };
    return colors[cat] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getCategoryColor(item.category)} dark:opacity-90`}>
          {item.category}
        </span>
        <button 
          className="p-2 rounded-md text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          onClick={() => onEdit(item)} 
          aria-label="Edit Item"
        >
          <Edit size={16} />
        </button>
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 m-0">{item.name}</h3>
      
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-dashed border-slate-200 dark:border-slate-600">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <Tag size={14} />
          <span>{item.size}</span>
        </div>
        <div className="font-bold text-lg text-primary dark:text-sky-400">
          ₹{item.price}
        </div>
      </div>
    </div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
