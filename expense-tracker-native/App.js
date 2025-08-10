import { AuthProvider } from "./context/AuthContext";
import { RootNavigator } from "./RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
