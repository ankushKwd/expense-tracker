import { useContext } from "react";
import { StyleSheet } from "react-native";
import { AuthContext } from "./context/AuthContext";
import { Ionicons } from "react-native-vector-icons/Ionicons";
import { DashboardScreen } from "./Screens/DashboardScreen";
import { TransactionListScreen } from "./Screens/TransactionListScreen";
import { TransactionFormScreen } from "./Screens/TransactionFormScreen";
import { BudgetListScreen } from "./Screens/BudgetListScreen";
import { BudgetFormScreen } from "./Screens/BudgetFormScreen";
import { ReportViewScreen } from "./Screens/ReportViewScreen";
import { CategoryManagementScreen } from "./Screens/CategoryManagementScreen";
import { UserProfileScreen } from "./Screens/UserProfileScreen";
import { LoginScreen } from "./Screens/LoginScreen";
import { RegisterScreen } from "./Screens/RegisterScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Transactions") {
            iconName = focused ? "cash" : "cash-outline";
          } else if (route.name === "Budgets") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else if (route.name === "Reports") {
            iconName = focused ? "analytics" : "analytics-outline";
          } else if (route.name === "Categories") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6", // blue-500
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#2563eb", // blue-600
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionStack} />
      <Tab.Screen name="Budgets" component={BudgetStack} />
      <Tab.Screen name="Reports" component={ReportViewScreen} />
      <Tab.Screen name="Categories" component={CategoryManagementScreen} />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          tabBarLabel: user ? user.firstName || user.username : "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

// Nested Stack Navigators for specific sections
function TransactionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionList" component={TransactionListScreen} />
      <Stack.Screen name="AddTransaction" component={TransactionFormScreen} />
      <Stack.Screen name="EditTransaction" component={TransactionFormScreen} />
    </Stack.Navigator>
  );
}

function BudgetStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BudgetList" component={BudgetListScreen} />
      <Stack.Screen name="AddBudget" component={BudgetFormScreen} />
    </Stack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { isLoggedIn } = useContext(AuthContext); // This hook re-renders when isLoggedIn changes
  console.log("App rendered with isLoggedIn:", isLoggedIn); // Add this log to observe the state

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // General Containers
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6", // gray-100
    padding: 20,
  },
  screenContainerScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6", // gray-100
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f3f4f6", // gray-100
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2937", // gray-800
    marginBottom: 20,
    textAlign: "center",
  },
});
