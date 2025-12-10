import { FileText, Calendar, DollarSign } from 'lucide-react';

const Invoices = () => {
  // TODO: Fetch from backend
  const invoices = [
    {
      id: 'INV-2025-001',
      bookName: 'Atomic Habits',
      amount: 14.99,
      date: '2025-12-03',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'INV-2025-002',
      bookName: 'The Silent Patient',
      amount: 15.49,
      date: '2025-12-01',
      paymentMethod: 'PayPal'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Invoices</h1>
        <p className="text-gray-600 dark:text-gray-400">View all your payment history</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Payment ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Book Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{invoice.bookName}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 text-green-600 dark:text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{invoice.amount.toFixed(2)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(invoice.date).toLocaleDateString()}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="inline-flex items-center space-x-1 text-primary hover:text-primary-dark">
                      <FileText className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
