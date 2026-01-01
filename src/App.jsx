import { useState, useMemo, useEffect } from 'react';
import { Package, Search, Plus, Moon, Sun } from 'lucide-react';
import { ItemCard } from './components/ItemCard';
import { Modal } from './components/Modal';
import { ItemForm } from './components/ItemForm';
import { plumbingItems, CATEGORIES, SIZES } from './data/mockData';

function App() {
  // Theme Management
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('plumbo_theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('plumbo_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Load from local storage or use mock data
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('plumbo_items');
    return saved ? JSON.parse(saved) : plumbingItems;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('plumbo_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Update existing
      setItems(items.map(i => i.id === editingItem.id ? { ...itemData, id: editingItem.id } : i));
    } else {
      // Create new
      const newItem = { ...itemData, id: Date.now() };
      setItems([newItem, ...items]);
    }
    setIsModalOpen(false);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSize = selectedSize === 'All' || item.size === selectedSize;
      return matchesSearch && matchesCategory && matchesSize;
    });
  }, [items, searchQuery, selectedCategory, selectedSize]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-primary dark:text-sky-400">
            <Package size={28} strokeWidth={2.5} />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Plumbo Inventory</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button className="btn btn-primary" onClick={handleAddItem}>
              <Plus size={20} />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        
        {/* Search & Filter Section */}
        <div className="card mb-8 flex flex-wrap gap-4 items-center justify-between dark:bg-slate-800 dark:border-slate-700 transition-colors duration-300">
          <div className="flex-1 min-w-[280px] relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
               type="text" 
               placeholder="Search items..." 
               className="input-field pl-11 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:dark:border-sky-500 focus:dark:ring-sky-500/20"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field py-3 pl-4 pr-10 appearance-none cursor-pointer hover:bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat} Categories</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>

            <div className="relative">
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
                className="input-field py-3 pl-4 pr-10 appearance-none cursor-pointer hover:bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
              >
                {SIZES.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <ItemCard key={item.id} item={item} onEdit={handleEditItem} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">No items found matching your filters.</p>
            </div>
          )}
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Item" : "Add New Item"}
      >
        <ItemForm 
          initialData={editingItem} 
          onSave={handleSaveItem} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}

export default App;
