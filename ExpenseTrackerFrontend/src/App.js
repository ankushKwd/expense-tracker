import { useContext, useEffect, useState } from "react";
import Profile from "./Components/Profile";
import BudgetForm from "./Components/BudgetForm";
import BudgetList from "./Components/BudgetList";
import CategoryManagement from "./Components/CategoryManagement";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Register from "./Components/Register";
import ReportView from "./Components/ReportView";
import TransactionForm from "./Components/TransactionForm";
import TransactionList from "./Components/TransactionList";
import { AuthContext } from "./Context/AuthContext";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(
    isLoggedIn ? "dashboard" : "login"
  );
  const [currentPageParams, setCurrentPageParams] = useState({});

  // Effect to navigate if auth state changes
  useEffect(() => {
    if (!isLoggedIn && currentPage !== "login" && currentPage !== "register") {
      setCurrentPage("login");
      setCurrentPageParams({});
    } else if (
      isLoggedIn &&
      (currentPage === "login" || currentPage === "register")
    ) {
      setCurrentPage("dashboard");
      setCurrentPageParams({});
    }
  }, [isLoggedIn, currentPage]);

  const navigateTo = (page, params = {}) => {
    setCurrentPage(page);
    setCurrentPageParams(params);
  };

  const renderPage = () => {
    // If not logged in, force to login/register unless explicitly on those pages
    if (!isLoggedIn && currentPage !== "login" && currentPage !== "register") {
      return <Login navigateTo={navigateTo} />;
    }

    switch (currentPage) {
      case "login":
        return <Login navigateTo={navigateTo} />;
      case "register":
        return <Register navigateTo={navigateTo} />;
      case "dashboard":
        return <Dashboard />;
      case "transactions":
        return <TransactionList navigateTo={navigateTo} />;
      case "add-transaction":
        return <TransactionForm navigateTo={navigateTo} />;
      case "edit-transaction":
        return (
          <TransactionForm
            navigateTo={navigateTo}
            transactionId={currentPageParams.id}
          />
        );
      case "budgets":
        return <BudgetList navigateTo={navigateTo} />;
      case "add-budget":
        return <BudgetForm navigateTo={navigateTo} />;
      case "edit-budget":
        // The backend API design for /budgets/{id} for GET is missing,
        // so editing here will just display the add form.
        return (
          <BudgetForm navigateTo={navigateTo} budgetId={currentPageParams.id} />
        );
      case "reports":
        return <ReportView />;
      case "categories":
        return <CategoryManagement />;
      case "profile": // New case for Profile
        return <Profile navigateTo={navigateTo} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {/* Tailwind CSS CDN and Inter font */}
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* Recharts CDN for Charting */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/recharts/2.1.8/recharts.min.js"></script>
      <style>
        {`
        body { font-family: 'Inter', sans-serif; }
        /* Custom scrollbar for better aesthetics, if needed */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        `}
      </style>

      <Navbar navigateTo={navigateTo} />
      <main className="py-8">{renderPage()}</main>
    </div>
  );
};

export default App;
