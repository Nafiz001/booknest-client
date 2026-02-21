import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, XCircle, CreditCard, Package, Truck, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      console.error(error);
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
    navigate(`/payment/${orderId}`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Toaster position="top-right" />
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Orders</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your book orders</p>
      </div>

      <div className="hidden md:block table-shell">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="table-head-cell">
                  Book
                </th>
                <th className="table-head-cell">
                  Order Date
                </th>
                <th className="table-head-cell">
                  Price
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
                <tr key={order._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="table-cell">
                    <div className="flex items-center space-x-4">
                      <img
                        src={order.bookImage}
                        alt={order.bookTitle}
                        className="h-16 w-12 rounded object-cover"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{order.bookTitle}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="table-cell font-semibold text-slate-900 dark:text-white">
                    ${Number(order.bookPrice || order.price || 0).toFixed(2)}
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      {order.status === 'pending' && (
                        <>
                          {order.paymentStatus === 'unpaid' && (
                            <button
                              onClick={() => handlePayNow(order._id)}
                              className="btn-primary text-xs"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Pay Now</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(order._id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
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

      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-4">
            <div className="flex space-x-4 mb-4">
              <img
                src={order.bookImage}
                alt={order.bookTitle}
                className="h-28 w-20 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{order.bookTitle}</h3>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-lg font-bold text-primary">${Number(order.bookPrice || order.price || 0).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              {getStatusBadge(order.status)}
            </div>

            {order.status === 'pending' && (
              <div className="flex space-x-2">
                {order.paymentStatus === 'unpaid' && (
                  <button
                    onClick={() => handlePayNow(order._id)}
                    className="btn-primary flex-1 text-xs"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Now</span>
                  </button>
                )}
                <button
                  onClick={() => handleCancel(order._id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
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
