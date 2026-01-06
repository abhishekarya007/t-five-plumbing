import PropTypes from 'prop-types';
import { X, AlertTriangle } from 'lucide-react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', destructive = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-[100]">
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-2xl flex flex-col animate-[modal-pop_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {destructive ? <AlertTriangle className="text-red-500" size={24} /> : null}
              {title}
            </h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            {message}
          </p>
          
          <div className="flex justify-end gap-3">
             <button 
              className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className={`btn ${destructive ? 'bg-red-500 hover:bg-red-600 text-white' : 'btn-primary'}`}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  destructive: PropTypes.bool,
};
