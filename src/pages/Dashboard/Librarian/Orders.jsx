import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const userId = user?.id || user?._id;
      const response = await api.get(`/orders/librarian/${userId}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? response.data.order : order
      ));
      toast.success('Order status updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || colors.pending;
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
      <Toaster position="top-right" />
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Operations</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Book Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Orders for your books will appear here
          </p>
        </div>
      ) : (
        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="table-head-cell">
                    Order ID
                  </th>
                  <th className="table-head-cell">
                    Customer
                  </th>
                  <th className="table-head-cell">
                    Book
                  </th>
                  <th className="table-head-cell">
                    Type
                  </th>
                  <th className="table-head-cell">
                    Amount
                  </th>
                  <th className="table-head-cell">
                    Status
                  </th>
                  <th className="table-head-cell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {orders.map((order) => (
                  <tr key={order._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="table-cell whitespace-nowrap text-sm font-mono">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="table-cell whitespace-nowrap">
                      <div className="text-sm font-medium">{order.user?.name}</div>
                      <div className="text-sm text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium">{order.book?.title}</div>
                      <div className="text-sm text-gray-500">{order.book?.author}</div>
                    </td>
                    <td className="table-cell whitespace-nowrap">
                      <span className="capitalize text-sm">{order.deliveryType}</span>
                    </td>
                    <td className="table-cell whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">${order.totalAmount}</div>
                    </td>
                    <td className="table-cell whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="table-cell whitespace-nowrap text-sm">
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="input-field py-1 px-2 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      )}
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

export default Orders;
