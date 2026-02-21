import { useState, useEffect } from 'react';
import { FileText, Calendar, DollarSign, Download } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/invoices/${user?.id || user?._id}`);
      setInvoices(response.data.invoices);
    } catch (err) {
      toast.error('Failed to load invoices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const downloadInvoice = (invoice) => {
    // Generate a simple text invoice
    const invoiceText = `
╔════════════════════════════════════════╗
║         BOOKNEST INVOICE               ║
╚════════════════════════════════════════╝

Invoice ID: ${invoice._id}
Transaction ID: ${invoice.transactionId || 'N/A'}
Date: ${new Date(invoice.paidAt || invoice.createdAt).toLocaleString()}

─────────────────────────────────────────
BOOK DETAILS
─────────────────────────────────────────
Title: ${invoice.bookTitle}
Price: $${Number(invoice.bookPrice).toFixed(2)}

─────────────────────────────────────────
CUSTOMER INFORMATION
─────────────────────────────────────────
Name: ${invoice.name}
Email: ${invoice.email}
Phone: ${invoice.phone}
Address: ${invoice.address}

─────────────────────────────────────────
PAYMENT DETAILS
─────────────────────────────────────────
Subtotal: $${Number(invoice.bookPrice).toFixed(2)}
Tax: $0.00
Total: $${Number(invoice.bookPrice).toFixed(2)}

Payment Status: ${invoice.paymentStatus.toUpperCase()}
Payment Method: Stripe

─────────────────────────────────────────
Thank you for your purchase!
Visit us at BookNest
─────────────────────────────────────────
    `;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice._id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Invoice downloaded!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Billing</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} found
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No invoices yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your paid orders will appear here as invoices
          </p>
        </div>
      ) : (
        <div className="table-shell">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="table-head-cell">
                  Payment ID
                </th>
                <th className="table-head-cell">
                  Book Name
                </th>
                <th className="table-head-cell">
                  Amount
                </th>
                <th className="table-head-cell">
                  Date
                </th>
                <th className="table-head-cell">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="table-cell">
                    <span className="font-mono text-sm text-primary">
                      #{invoice._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="table-cell text-gray-900 dark:text-white">{invoice.bookTitle}</td>
                  <td className="table-cell">
                    <span className="inline-flex items-center space-x-1 text-green-600 dark:text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{Number(invoice.bookPrice).toFixed(2)}</span>
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString()}</span>
                    </span>
                  </td>
                  <td className="table-cell">
                    <button 
                      onClick={() => downloadInvoice(invoice)}
                      className="inline-flex items-center space-x-1 text-primary transition-colors hover:text-primary-dark"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default Invoices;
