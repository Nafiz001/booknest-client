import { useState, useEffect } from 'react';
import { Clock, XCircle, CreditCard, Package, Truck, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const userId = user?.id || user?._id;
      const response = await api.get(`/orders/user/${userId}`);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.delete(`/orders/${orderId}`);
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
        toast.success('Order cancelled successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const handlePayNow = (orderId) => {
    toast.success('Redirecting to payment page...');
    setTimeout(() => {
      window.location.href = `/payment/${orderId}`;
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
      shipped: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle }
    };
    
    const { color, icon: Icon } = badges[status] || badges.pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
        <Icon className="w-4 h-4" />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your book orders</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={order.bookImage}
                        alt={order.bookTitle}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{order.bookTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                    ${order.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {order.status === 'pending' && (
                        <>
                          {order.paymentStatus === 'unpaid' && (
                            <button
                              onClick={() => handlePayNow(order.id)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Pay Now</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No actions available</span>
                      )}
                      {(order.status === 'shipped' || order.status === 'delivered') && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Paid</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-4">
            <div className="flex space-x-4 mb-4">
              <img
                src={order.bookImage}
                alt={order.bookTitle}
                className="w-20 h-28 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{order.bookTitle}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="text-lg font-bold text-primary">${order.price.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              {getStatusBadge(order.status)}
            </div>

            {order.status === 'pending' && (
              <div className="flex space-x-2">
                {order.paymentStatus === 'unpaid' && (
                  <button
                    onClick={() => handlePayNow(order.id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Now</span>
                  </button>
                )}
                <button
                  onClick={() => handleCancel(order.id)}
                  className="flex-1 inline-flex items-center justify-center space-x-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Start browsing books to place your first order!</p>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
