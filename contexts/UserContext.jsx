import { ID } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/src/lib/appwrite"; // Ensure correct import path
import { toast } from "@/lib/toast"; // Ensure correct import path

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const loggedInUser = await account.get(); // Fetch user data
      setUser(loggedInUser);
      toast("Welcome back! You are logged in.");
    } catch (err) {
      toast("Login failed: " + err.message);
    }
  }

  async function logout() {
    try {
      await account.deleteSession("current");
      setUser(null);
      toast("Logged out successfully.");
    } catch (err) {
      toast("Logout failed: " + err.message);
    }
  }

  async function register(email, password) {
    await account.create(ID.unique(), email, password);
    await login(email, password);
    toast('Account created');
      }

  async function init() {
    try {
      const loggedInUser = await account.get();
      setUser(loggedInUser);
      toast("Welcome back!");
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}
