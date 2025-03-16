import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { toast } from "../lib/toast";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null); 

  async function login(email, password) {
    const loggedIn = await account.createEmailPasswordSession(email, password);
    setUser(loggedIn);
    toast('Welcome back. You are logged in');
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    toast('Logged out');
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
