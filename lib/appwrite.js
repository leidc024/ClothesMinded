import { Client, Databases, Account } from "react-native-appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67ad0aec0002e74ec57d") // Replace with your project ID
  .setPlatform('com.leidc024.ClothesMindedv1');

export const account = new Account(client);
export const databases = new Databases(client);