import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});
import HomeGoodreads from './pages/Home/HomeGoodreads';
import AllBooks from './pages/Books/AllBooks';
import BookDetails from './pages/Books/BookDetails';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import MyOrders from './pages/Dashboard/User/MyOrders';
import MyProfile from './pages/Dashboard/User/MyProfile';
import Invoices from './pages/Dashboard/User/Invoices';
import MyWishlist from './pages/Dashboard/User/MyWishlist';
import AddBook from './pages/Dashboard/Librarian/AddBook';
import MyBooks from './pages/Dashboard/Librarian/MyBooks';
import Orders from './pages/Dashboard/Librarian/Orders';
import AllUsers from './pages/Dashboard/Admin/AllUsers';
import ManageBooks from './pages/Dashboard/Admin/ManageBooks';
import Payment from './pages/Payment/Payment';
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import LibrarianRoute from './components/LibrarianRoute';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
              <Route path="/" element={<HomeGoodreads />} />
              <Route path="/all-books" element={<AllBooks />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/payment/:orderId" element={<PrivateRoute><Payment /></PrivateRoute>} />
              <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route index element={<DashboardHome />} />
                {/* User Routes */}
                <Route path="my-orders" element={<MyOrders />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="wishlist" element={<MyWishlist />} />
                
                {/* Librarian Routes */}
                <Route path="add-book" element={<LibrarianRoute><AddBook /></LibrarianRoute>} />
                <Route path="my-books" element={<LibrarianRoute><MyBooks /></LibrarianRoute>} />
                <Route path="orders" element={<LibrarianRoute><Orders /></LibrarianRoute>} />
                
                {/* Admin Routes */}
                <Route path="all-users" element={<AdminRoute><AllUsers /></AdminRoute>} />
                <Route path="manage-books" element={<AdminRoute><ManageBooks /></AdminRoute>} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

