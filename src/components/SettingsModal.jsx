import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Plus, Trash2 } from 'lucide-react';

export function SettingsModal({ 
  isOpen, 
  onClose, 
  categories, 
  setCategories, 
  sizes, 
  setSizes 
}) {
  const [newCategory, setNewCategory] = useState('');
  const [newSize, setNewSize] = useState('');
  const [activeTab, setActiveTab] = useState('categories');

  if (!isOpen) return null;

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (cat) => {
    if (confirm(`Are you sure you want to delete "${cat}"?`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const handleDeleteSize = (s) => {
    if (confirm(`Are you sure you want to delete "${s}"?`)) {
      setSizes(sizes.filter(sz => sz !== s));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-lg shadow-2xl flex flex-col animate-[modal-pop_0.2s_ease-out] overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'categories' ? 'text-primary border-b-2 border-primary bg-sky-50 dark:bg-sky-900/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            onClick={() => setActiveTab('categories')}
          >
            Manage Categories
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'sizes' ? 'text-primary border-b-2 border-primary bg-sky-50 dark:bg-sky-900/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
            onClick={() => setActiveTab('sizes')}
          >
            Manage Sizes
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'categories' ? (
            <div className="flex flex-col gap-4">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category Name"
                  className="input-field py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <button type="submit" className="btn btn-primary py-2 px-3" disabled={!newCategory.trim()}>
                  <Plus size={20} />
                </button>
              </form>
              <div className="flex flex-col gap-2">
                {categories.filter(c => c !== 'All').map(cat => (
                  <div key={cat} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{cat}</span>
                    <button 
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <form onSubmit={handleAddSize} className="flex gap-2">
                <input 
                  type="text" 
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="New Size (e.g. 2 inch)"
                  className="input-field py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <button type="submit" className="btn btn-primary py-2 px-3" disabled={!newSize.trim()}>
                  <Plus size={20} />
                </button>
              </form>
              <div className="flex flex-col gap-2">
                 {sizes.filter(s => s !== 'All').map(size => (
                  <div key={size} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{size}</span>
                    <button 
                      onClick={() => handleDeleteSize(size)}
                      className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  setCategories: PropTypes.func.isRequired,
  sizes: PropTypes.array.isRequired,
  setSizes: PropTypes.func.isRequired,
};
