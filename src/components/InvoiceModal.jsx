import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { X, Printer, Trash2, Plus, Minus } from 'lucide-react';

export function InvoiceModal({ isOpen, onClose, invoiceItems, updateQuantity, updateDiscount, removeFromInvoice, clearInvoice, openConfirm }) {
  // ... existing code ...

  // To fix line numbers, I'll use a larger context manually or just rely on the tool finding the start.
  // Wait, I need to check where `InvoiceModal` starts.
  // It starts at line 5.

  const [customerName, setCustomerName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [previousBalance, setPreviousBalance] = useState('');
  const [terms, setTerms] = useState(`1. Description of Goods वाले Columns में जहां भी Item Name के Last म N/R लखा होगा वह Item/Product Return नही लिया जायेगा ।
2. डिलीवरी Date के 42 दन के अंदर बचा हुआ समान Return कर ले, Total Purchase Value का 25% ही Item Return लिए जायेंगे ।
3. हमारे यहां सभी हार्डवेयर और प्लम्बर का सामान उपलब्ध है । Alpro कंपनी का प्लाई का पल्ला और सनमाइका उपलब्ध है।
FREE HOME DELIVERY

हमारे साथ व्यापार करन केे लए धन्यवाद ।`);
  const printRef = useRef();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Calculate Subtotal
  const subtotal = invoiceItems.reduce((sum, item) => {
    const discountVal = parseFloat(item.discount) || 0;
    const discountAmount = (item.price * discountVal) / 100;
    const finalPrice = item.price - discountAmount;
    return sum + (finalPrice * item.quantity);
  }, 0);

  // Calculate Grand Total
  const grandTotal = subtotal + (parseFloat(previousBalance) || 0);

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
                className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:dark:border-sky-500 focus:dark:ring-sky-500/20 print:border-none print:p-0 print:font-bold print:text-lg print:placeholder-transparent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 print:text-black">Date</label>
              <input 
                type="date" 
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="input-field dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:dark:border-sky-500 focus:dark:ring-sky-500/20 print:border-none print:p-0"
              />
            </div>
          </div>

          {/* Invoice Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium text-sm">
                <th className="py-3 px-2 w-[30%]">Item Description</th>
                <th className="py-3 px-2 text-center w-[10%]">Size</th>
                <th className="py-3 px-2 text-center w-[10%]">List Price</th>
                <th className="py-3 px-2 text-center w-[10%]">Disc %</th>
                <th className="py-3 px-2 text-center w-[10%]">Price</th>
                <th className="py-3 px-2 text-center w-[15%]">Qty</th>
                <th className="py-3 px-2 text-right w-[10%]">Total</th>
                <th className="py-3 px-2 w-[5%] print:hidden"></th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-200">
              {invoiceItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
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
                invoiceItems.map((item) => {
                  const discountVal = parseFloat(item.discount) || 0;
                  const discountAmount = (item.price * discountVal) / 100;
                  const finalPrice = item.price - discountAmount;
                  const lineTotal = finalPrice * item.quantity;
                  
                  return (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 print:hover:bg-transparent">
                      <td className="py-3 px-2 font-medium">
                        {item.name} <span className="text-xs text-slate-400 font-normal ml-2">({item.category})</span>
                      </td>
                      <td className="py-3 px-2 text-center text-sm">{item.size}</td>
                      <td className="py-3 px-2 text-center text-slate-500">₹{item.price}</td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                             type="text"
                             inputMode="decimal"
                             value={item.discount}
                             onChange={(e) => updateDiscount(item.id, e.target.value)}
                             className="w-12 p-1 border border-slate-200 rounded text-center text-sm focus:outline-none focus:border-primary bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white print:border-none print:bg-transparent print:p-0 print:w-8 print:text-right"
                             placeholder="0"
                          />
                          <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">%</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-semibold">₹{finalPrice.toFixed(2)}</td>
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
                      <td className="py-3 px-2 text-right font-medium">₹{lineTotal.toFixed(2)}</td>
                      <td className="py-3 px-2 text-center print:hidden">
                        <button 
                          onClick={() => removeFromInvoice(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td colSpan="5" className="pt-6 pb-2 text-right font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-sm">Subtotal</td>
                <td colSpan="2" className="pt-6 pb-2 text-right font-bold text-lg text-slate-700 dark:text-slate-300">
                  ₹{subtotal.toFixed(2)}
                </td>
                <td className="print:hidden"></td>
              </tr>
              <tr>
                <td colSpan="5" className="py-2 text-right font-medium text-slate-500 dark:text-slate-400 text-sm align-middle">Previous Balance (+/-)</td>
                <td colSpan="2" className="py-2 text-right">
                  <div className="flex justify-end print:hidden">
                    <input
                      type="number"
                      value={previousBalance}
                      onChange={(e) => setPreviousBalance(e.target.value)}
                      placeholder="0.00"
                      className="w-32 py-1 px-2 text-right bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <div className="hidden print:block font-semibold">
                    {previousBalance ? (parseFloat(previousBalance) < 0 ? '-' : '+') : ''} ₹{Math.abs(parseFloat(previousBalance) || 0).toFixed(2)}
                  </div>
                </td>
                <td className="print:hidden"></td>
              </tr>
              <tr className="border-t-2 border-slate-900 dark:border-slate-100">
                <td colSpan="5" className="pt-6 text-right font-bold text-slate-900 dark:text-white uppercase tracking-wide text-lg">Grand Total</td>
                <td colSpan="2" className="pt-6 text-right font-bold text-3xl text-primary dark:text-sky-400">
                  ₹{grandTotal.toFixed(2)}
                </td>
                <td className="print:hidden"></td>
              </tr>
            </tfoot>
          </table>

          {/* Terms & Conditions */}
          <div className="mt-8 break-inside-avoid">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 print:hidden">Terms & Conditions</label>
            
            {/* Editing View */}
            <textarea 
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Enter terms and conditions..."
              rows="6"
              className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none print:hidden"
            />
            
            {/* Print View */}
            <div className="hidden print:block text-sm text-slate-800 whitespace-pre-wrap leading-relaxed border-t pt-4">
              <p className="font-bold mb-1 underline">Terms & Conditions:</p>
              {terms.split('\n').map((line, i) => {
                if (line.includes('FREE HOME DELIVERY')) {
                   return <p key={i} className="font-extrabold text-lg mt-1 mb-1">{line}</p>;
                }
                return <p key={i}>{line}</p>;
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 print:hidden">
            <button 
              className="btn text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100"
              onClick={() => {
                openConfirm({
                  title: 'Clear Invoice',
                  message: 'Are you sure you want to clear all items from the invoice?',
                  destructive: true,
                  confirmText: 'Clear All',
                  onConfirm: clearInvoice
                });
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
  updateDiscount: PropTypes.func.isRequired,
  removeFromInvoice: PropTypes.func.isRequired,
  clearInvoice: PropTypes.func.isRequired,
  openConfirm: PropTypes.func.isRequired,
};
