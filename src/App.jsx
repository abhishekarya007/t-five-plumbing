import { useState, useMemo, useEffect } from 'react';
import { Package, Search, Plus, Moon, Sun, Settings, ShoppingCart } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './supabaseClient';
import { ItemCard } from './components/ItemCard';
import { Modal } from './components/Modal';
import { ItemForm } from './components/ItemForm';
import { SettingsModal } from './components/SettingsModal';
import { InvoiceModal } from './components/InvoiceModal';
import { CATEGORIES as DEFAULT_CATEGORIES, SIZES as DEFAULT_SIZES } from './data/mockData';
import { ConfirmationModal } from './components/ConfirmationModal';

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

  // Supabase Data Management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Categories & Sizes Management
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [sizes, setSizes] = useState(DEFAULT_SIZES);

  const fetchSettings = async () => {
    try {
      const { data: catData } = await supabase.from('categories').select('name').order('name');
      if (catData && catData.length > 0) {
        setCategories(['All', ...catData.map(c => c.name)]);
      }

      const { data: sizeData } = await supabase.from('sizes').select('name').order('name');
      if (sizeData && sizeData.length > 0) {
        setSizes(['All', ...sizeData.map(s => s.name)]);
      }
    } catch (error) {
      console.error('Error fetching settings:', error.message);
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const { error } = await supabase.from('categories').insert([{ name }]);
      if (error) throw error;
      fetchSettings();
      toast.success('Category added successfully');
    } catch (error) {
      toast.error(`Error adding category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (name) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('name', name);
      if (error) throw error;
      fetchSettings();
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error(`Error deleting category: ${error.message}`);
    }
  };

  const handleAddSize = async (name) => {
    try {
      const { error } = await supabase.from('sizes').insert([{ name }]);
      if (error) throw error;
      fetchSettings();
      toast.success('Size added successfully');
    } catch (error) {
      toast.error(`Error adding size: ${error.message}`);
    }
  };

  const handleDeleteSize = async (name) => {
    try {
      const { error } = await supabase.from('sizes').delete().eq('name', name);
      if (error) throw error;
      fetchSettings();
      toast.success('Size deleted successfully');
    } catch (error) {
      toast.error(`Error deleting size: ${error.message}`);
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSettings();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    destructive: false,
    confirmText: 'Confirm'
  });

  const openConfirm = ({ title, message, onConfirm, destructive = false, confirmText = 'Confirm' }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      destructive,
      confirmText
    });
  };

  const closeConfirm = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Invoice State
  const [invoiceItems, setInvoiceItems] = useState([]);

  const handleAddToInvoice = (item) => {
    setInvoiceItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, discount: 0 }];
    });
    toast.success('Added to invoice');
  };

  const handleUpdateInvoiceQuantity = (id, newQty) => {
    setInvoiceItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleUpdateInvoiceDiscount = (id, newDiscount) => {
    // Store as string to allow typing (e.g. empty string or "1.")
    // We will parse it for calculations
    if (newDiscount === '' || /^\d*\.?\d*$/.test(newDiscount)) {
      setInvoiceItems(prev => prev.map(item => item.id === id ? { ...item, discount: newDiscount } : item));
    }
  };

  const handleRemoveFromInvoice = (id) => {
    setInvoiceItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearInvoice = () => {
    setInvoiceItems([]);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemData, closeOnSave = true) => {
    try {
      if (editingItem) {
        // Update existing
        const { error } = await supabase
          .from('items')
          .update({
            name: itemData.name,
            category: itemData.category,
            size: itemData.size,
            price: itemData.price
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        
        // Optimistic update or refetch
        fetchItems();
      } else {
        // Create new
        const { error } = await supabase
          .from('items')
          .insert([{
            name: itemData.name,
            category: itemData.category,
            size: itemData.size,
            price: itemData.price
          }]);

        if (error) throw error;
        fetchItems();
      }
      toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully');
      if (closeOnSave) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving item:', error.message);
      toast.error(`Failed to save item: ${error.message}`);
    }
  };

  const handleDeleteItem = (id) => {
    openConfirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      destructive: true,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('items').delete().eq('id', id);
          if (error) throw error;
          fetchItems();
          toast.success('Item deleted successfully');
        } catch (error) {
          console.error('Error deleting item:', error.message);
          toast.error(`Failed to delete item: ${error.message}`);
        }
      }
    });
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
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm transition-colors duration-300 print:hidden">
        <div className="container mx-auto px-4 py-3 md:py-4 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3 text-primary dark:text-sky-400">
            <Package size={24} strokeWidth={2.5} className="md:w-7 md:h-7" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Plumbo</h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
             <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button 
              className="btn bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-300 relative px-3 md:px-4" 
              onClick={() => setIsInvoiceOpen(true)}
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Invoice</span>
              {invoiceItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
                  {invoiceItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            <button className="btn btn-primary px-3 md:px-4" onClick={handleAddItem}>
              <Plus size={20} />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1 print:hidden">
        
        {/* Search & Filter Section */}
        <div className="card mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between dark:bg-slate-800 dark:border-slate-700 transition-colors duration-300">
          <div className="relative w-full md:flex-1 md:min-w-[280px]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
               type="text" 
               placeholder="Search items..." 
               className="input-field pl-11 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:dark:border-sky-500 focus:dark:ring-sky-500/20"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-full py-3 pl-4 pr-10 appearance-none cursor-pointer hover:bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat} Categories</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>

            <div className="relative flex-1">
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
                className="input-field w-full py-3 pl-4 pr-10 appearance-none cursor-pointer hover:bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"
              >
                {sizes.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading inventory...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onEdit={handleEditItem} 
                onDelete={handleDeleteItem} 
                onAddToInvoice={handleAddToInvoice}
              />
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
          categories={categories}
          sizes={sizes}
        />
      </Modal>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        sizes={sizes}
        onAddSize={handleAddSize}
        onDeleteSize={handleDeleteSize}
        openConfirm={openConfirm}
      />

      <InvoiceModal 
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoiceItems={invoiceItems}
        updateQuantity={handleUpdateInvoiceQuantity}
        updateDiscount={handleUpdateInvoiceDiscount}
        removeFromInvoice={handleRemoveFromInvoice}
        clearInvoice={handleClearInvoice}
        openConfirm={openConfirm}
      />
      <Toaster position="bottom-right" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white',
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: 'green',
          },
        },
        error: {
          style: {
            background: 'red',
          },
        },
      }} />
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        destructive={confirmModal.destructive}
        confirmText={confirmModal.confirmText}
      />
    </div>
  );
}

export default App;
