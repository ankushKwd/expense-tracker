import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Navbar = ({ navigateTo }) => {
  const { isLoggedIn, logout, user } = useContext(AuthContext); // Get user from context

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={() => navigateTo("dashboard")}
        >
          💰 Finance Tracker
        </div>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => navigateTo("dashboard")}
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigateTo("transactions")}
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Transactions
              </button>
              <button
                type="button"
                onClick={() => navigateTo("budgets")}
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Budgets
              </button>
              <button
                type="button"
                onClick={() => navigateTo("reports")}
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Reports
              </button>
              <button
                type="button"
                onClick={() => navigateTo("categories")}
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Categories
              </button>
              <button
                type="button"
                onClick={() => navigateTo("profile")}
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                {user ? user.firstName || user.username : "Profile"}
                {/* Display name or username */}
              </button>
              <button
                type="button"
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigateTo("login")}
              className="bg-green-500 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
