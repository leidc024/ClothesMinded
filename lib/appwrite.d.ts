// types/appwrite.d.ts
declare module "@/lib/appwrite" {
  import { Client, Databases, Account, Storage } from "react-native-appwrite";

  export const client: Client;
  export const account: Account;
  export const databases: Databases;
  export const storage: Storage;
}