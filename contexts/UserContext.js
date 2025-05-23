import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { toast } from "../lib/toast";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export async function checkSession(){
  try {
      const session = await account.getSession('current');
      console.log("Session exists:", session);
      return true; // Session exists
  } catch (error) {
      console.log("No active session:", error);
      return false; // No session exists
  }
};

export async function getUserSession() {
  try {
      // Get user account details
      const user = await account.get();
      console.log("User Details:", user);

      // Get current session details
      const session = await account.getSession("current");
      console.log("Current Session:", session);

  } catch (error) {
      console.error("Error fetching session:", error);
  }
}

export function UserProvider(props) {
  const [user, setUser] = useState(null); 

  async function login(email, password) {
    const loggedIn = await account.createEmailPasswordSession(email, password);
    setUser(loggedIn);
    toast('Welcome back. You are logged in');
  }

  async function logout() {
    try {
      await account.deleteSession("current");
      setUser(null);
      toast('Logged out');
    } catch (err) {
      toast('Failed to log out. Please try again.');
      console.error("Logout failed:", err);
      // Optionally: setUser(null) here too if you want to force local logout
    }
  }

  async function register(email, password, username) {
    try {
      await account.create(ID.unique(), email, password, username);
      await login(email, password);
      await account.createVerification("http://localhost:3000/verify");
      toast('Account created');
    } 
    catch (err) {
      toast(err.message);
    }
  }

  async function init() {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
      toast('Welcome back. You are logged in');
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, login, logout, register, toast }}>
      {props.children}
    </UserContext.Provider>
  );
}
