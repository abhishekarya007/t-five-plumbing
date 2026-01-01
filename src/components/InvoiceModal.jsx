import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { X, Printer, Trash2, Plus, Minus } from 'lucide-react';

export function InvoiceModal({ isOpen, onClose, invoiceItems, updateQuantity, removeFromInvoice, clearInvoice }) {
  const [customerName, setCustomerName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const printRef = useRef();

  if (!isOpen) return null;

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 print:p-0 print:bg-white print:fixed print:inset-0 print:z-[100]">
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-3xl shadow-2xl flex flex-col animate-[modal-pop_0.2s_ease-out] overflow-hidden max-h-[90vh] print:max-h-none print:rounded-none print:shadow-none print:animate-none print:w-full print:h-full" 
        onClick={e => e.stopPropagation()}
        ref={printRef}
      >
        {/* Modal Header / Print Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 print:bg-white print:border-b-2 print:border-black">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white print:text-3xl print:text-black">Invoice / Estimate</h2>
          <div className="flex gap-2 print:hidden">
            <button 
              onClick={handlePrint}
              className="btn btn-primary"
              title="Print Invoice"
            >
              <Printer size={20} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto print:overflow-visible print:p-8">
          
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 print:text-black">Customer Name</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="input-field print:border-none print:p-0 print:font-bold print:text-lg print:placeholder-transparent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 print:text-black">Date</label>
              <input 
                type="date" 
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="input-field print:border-none print:p-0"
              />
            </div>
          </div>

          {/* Invoice Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium text-sm">
                <th className="py-3 px-2 w-[40%]">Item Description</th>
                <th className="py-3 px-2 text-center w-[15%]">Size</th>
                <th className="py-3 px-2 text-center w-[15%]">Price</th>
                <th className="py-3 px-2 text-center w-[15%]">Qty</th>
                <th className="py-3 px-2 text-right w-[15%]">Total</th>
                <th className="py-3 px-2 w-[5%] print:hidden"></th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-200">
              {invoiceItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-lg italic">Your invoice is empty.</p>
                      <p className="text-sm">Click the <span className="inline-block p-1 bg-sky-100 text-sky-700 rounded mx-1"><Plus size={12} className="inline"/> Cart Icon</span> on items to add them here.</p>
                      <button 
                        onClick={onClose}
                        className="btn btn-primary mt-2"
                      >
                        Go to Inventory
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                invoiceItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 print:hover:bg-transparent">
                    <td className="py-3 px-2 font-medium">
                      {item.name} <span className="text-xs text-slate-400 font-normal ml-2">({item.category})</span>
                    </td>
                    <td className="py-3 px-2 text-center text-sm">{item.size}</td>
                    <td className="py-3 px-2 text-center">₹{item.price}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-2 print:hidden">
                        <button 
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button 
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="hidden print:block text-center">{item.quantity}</span>
                    </td>
                    <td className="py-3 px-2 text-right font-medium">₹{item.price * item.quantity}</td>
                    <td className="py-3 px-2 text-center print:hidden">
                      <button 
                        onClick={() => removeFromInvoice(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                <td colSpan="3" className="pt-4 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-sm">Grand Total</td>
                <td colSpan="2" className="pt-4 text-right font-bold text-2xl text-primary dark:text-sky-400">₹{calculateTotal()}</td>
                <td className="print:hidden"></td>
              </tr>
            </tfoot>
          </table>

          {/* Footer for Print */}
          <div className="hidden print:block mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>Thank you for your business!</p>
            <p className="mt-1">Generated by Plumbo Inventory App</p>
          </div>

          <div className="mt-8 flex justify-end gap-3 print:hidden">
             <button 
              className="btn text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100"
              onClick={() => {
                if(confirm('Clear all items from invoice?')) clearInvoice();
              }}
              disabled={invoiceItems.length === 0}
            >
              Clear Invoice
            </button>
             <button 
              className="btn btn-primary"
              onClick={handlePrint}
              disabled={invoiceItems.length === 0}
            >
              <Printer size={20} />
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

InvoiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invoiceItems: PropTypes.array.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  removeFromInvoice: PropTypes.func.isRequired,
  clearInvoice: PropTypes.func.isRequired,
};
