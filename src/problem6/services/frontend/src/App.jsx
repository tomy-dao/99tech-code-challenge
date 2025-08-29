import { useState, useEffect } from "react";
import AuthContainer from "./components/AuthContainer";
import auth from "./clients/auth";
import { newSocket, newSocketListener } from "./lib/socket";
import { DefaultEvent } from "./lib/socket/socket";
import { config } from "./config";
import { Toaster } from "./components/ui/sonner";
import io from "socket.io-client";
import Home from "./home";

export const socket = io("http://localhost:8080/user");
export const eventListener = newSocketListener();

function App() {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
  };

  useEffect(() => {
    if (!user) return;
    socket.auth = {
      token: localStorage.getItem("authToken"),
    };
    socket.connect();
    const signalConnected = socket.on(DefaultEvent.Connected, () => {
      console.log("connected");
    });


    return () => {
      signalConnected.off();
      socket.disconnect();
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <Home onLogout={handleLogout} />
      ) : (
        <AuthContainer onAuthSuccess={handleAuthSuccess} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
