import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomeGoodreads from './pages/Home/HomeGoodreads';
import AllBooks from './pages/Books/AllBooks';
import BookDetails from './pages/Books/BookDetails';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RequestDelivery from './pages/RequestDelivery';
import DashboardLayout from './layouts/DashboardLayout';
import MyOrders from './pages/Dashboard/User/MyOrders';
import MyProfile from './pages/Dashboard/User/MyProfile';
import Invoices from './pages/Dashboard/User/Invoices';
import AddBook from './pages/Dashboard/Librarian/AddBook';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeGoodreads />} />
              <Route path="/books" element={<AllBooks />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/request-delivery" element={<RequestDelivery />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route path="my-orders" element={<MyOrders />} />
                <Route path="profile" element={<MyProfile />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="add-book" element={<AddBook />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

