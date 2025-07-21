# Contractor2

This project is a Next.js application that relies on Firebase for authentication and data storage.

## Configuration

The app expects several Firebase credentials to be present in your environment. Create a `.env.local` file in the project root and add the following variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<your api key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your auth domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your project id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your storage bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your messaging sender id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your app id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<optional measurement id>

FIREBASE_PROJECT_ID=<same as above project id>
FIREBASE_CLIENT_EMAIL=<firebase service account client email>
FIREBASE_PRIVATE_KEY=<firebase service account private key>
```

The public variables (prefixed with `NEXT_PUBLIC_`) are required both on the client and the server. The remaining variables are used only on the server when initializing Firebase Admin.

## Running the app

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The utility in `lib/env.client.ts` and `lib/env.server.ts` validates these variables at startup using [Zod](https://github.com/colinhacks/zod). If any are missing, the application will throw an error during initialization.

## Local Firebase Emulators

To test Firebase services locally, install the Firebase CLI and run:

```bash
firebase emulators:start
```

This command reads `.firebaserc` for the project ID and uses the ports defined in `firebase.json`.
