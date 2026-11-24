# Cambodia Eats

Cambodia Eats is an Expo / React Native food journal. Appwrite handles email/password authentication and stores each signed-in user's places in a private table. Guest sample data stays on the device.

## Run the app

```powershell
npm start
```

Open the QR code with Expo Go. Restart Expo after changing `.env`.

## Configure Appwrite

1. Create an Appwrite Cloud project.
2. Add Android and iOS platforms with this package / bundle identifier:
   `com.cambodiaeats.app`
3. In **Databases**, create a database (for example, ID `food-journal-db`) and a table (for example, ID `places`).
4. Add these columns to the table:

   | Column | Type | Required |
   | --- | --- | --- |
   | `ownerId` | String (36) | Yes |
   | `name` | String (128) | Yes |
   | `province` | String (64) | Yes |
   | `price` | Double | Yes |
   | `rating` | Double | Yes |
   | `category` | String (64) | Yes |
   | `notes` | String (2000) | Yes |
   | `image` | String (2048) | Yes |
   | `isFavorite` | Boolean | Yes |
   | `collection` | String (128) | Yes |
   | `addedBy` | String (128) | Yes |

5. Enable **Row security**. Grant the **Users** role table-level **Create** permission only. The app grants each row's owner read, update, and delete permissions; do not grant table-wide read access.
6. Create an ascending key index for the `ownerId` column so the app's per-user query is supported.
7. Copy `.env.example` to `.env` and replace the endpoint and IDs with values from your Appwrite project:

   ```powershell
   Copy-Item .env.example .env
   ```

   Set `EXPO_PUBLIC_APPWRITE_ENDPOINT` to the endpoint for your Appwrite Cloud region, and set the project, database, and table IDs. These client-side IDs are not API keys. **Never put an Appwrite server API key in the mobile app.**

8. Start Expo again. Create an account from the Profile screen; saved places will then load from and write to Appwrite.

Appwrite's email delivery must be enabled for password recovery. Guest samples and account data are kept separate; sample places are not automatically copied into a new account. Place images selected from the device are stored as local URIs in this version, while place records are stored in Appwrite. Invitations and multi-user shared collections are not connected yet.
