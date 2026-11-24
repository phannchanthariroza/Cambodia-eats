import {
  Account,
  Client,
  ID,
  Permission,
  Query,
  Role,
  TablesDB,
} from 'react-native-appwrite';

const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  tableId: process.env.EXPO_PUBLIC_APPWRITE_PLACES_TABLE_ID,
  platform: 'com.cambodiaeats.app',
};

const hasPlaceholder = (value) => !value || value.includes('<') || value.includes('YOUR_');

export const isAppwriteConfigured = ![
  config.endpoint,
  config.projectId,
  config.databaseId,
  config.tableId,
].some(hasPlaceholder);

const client = new Client();

if (isAppwriteConfigured) {
  client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);
}

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export { ID, Permission, Query, Role };
export const appwriteConfig = config;
