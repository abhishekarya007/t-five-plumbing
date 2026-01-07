import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export function ItemForm({ initialData, onSave, onCancel, categories, sizes }) {
  const [formData, setFormData] = useState({
    name: '',
    category: categories[1] || '',
    size: sizes[1] || '',
    price: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price)
    });
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Item Name</label>
        <input 
          type="text" 
          required
          className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:dark:border-sky-500 focus:dark:ring-sky-500/20"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="e.g., Brass Elbow"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <div className="relative">
            <select 
              className="input-field appearance-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Size</label>
          <div className="relative">
            <select 
              className="input-field appearance-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              value={formData.size}
              onChange={e => setFormData({...formData, size: e.target.value})}
            >
               {sizes.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price (₹)</label>
        <input 
          type="number" 
          required
          min="0"
          className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:dark:border-sky-500 focus:dark:ring-sky-500/20"
          value={formData.price}
          onChange={e => setFormData({...formData, price: e.target.value})}
          placeholder="0.00"
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
        <button 
          type="button" 
          className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 w-full sm:w-auto" 
          onClick={onCancel}
        >
          Cancel
        </button>
        
        {!initialData && (
          <button 
            type="button" 
            className="btn bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-300 w-full sm:w-auto"
            onClick={(e) => {
              e.preventDefault();
              onSave({
                ...formData,
                price: Number(formData.price)
              }, false); // Pass false to keep modal open
            }}
          >
            Save & Next
          </button>
        )}

        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          {initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}

ItemForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  sizes: PropTypes.array.isRequired,
};
