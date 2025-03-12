import mongoose from "mongoose";

const { DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT, MONGODB_URI } = process.env;

if ((!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME || !DB_PORT) && !MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI OR DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT environment variables.",
  );
}

const dbString: string = MONGODB_URI ?? `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const connectionOptions = {
  authSource: "admin",
  connectTimeoutMS: 10000,
  socketTimeoutMS: 5000,
  heartbeatFrequencyMS: 2500,
  serverSelectionTimeoutMS: 5000,
};

// Setup der Connection-Events
mongoose.connection.on("connected", () => {
  console.log("Database connected.");
});
mongoose.connection.on("reconnected", () => {
  console.log("Database reconnected.");
});
mongoose.connection.on("close", () => {
  console.log("Database connection closed.");
});
mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected.");
});
mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

/**
 * Stellt die Verbindung zur Datenbank her.
 * Falls bereits eine Verbindung besteht, wird diese zurückgegeben.
 */
export async function connect(): Promise<mongoose.mongo.Db | undefined> {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if ([1, 2].includes(mongoose.connection.readyState)) {
    console.log("Already connected to database.");
    return mongoose.connection.db;
  }

  try {
    await mongoose.connect(dbString, connectionOptions);
    return mongoose.connection.db;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

/**
 * Schließt die Datenbankverbindung, sofern vorhanden.
 */
export async function disconnect(): Promise<void> {
  if ([0, 3].includes(mongoose.connection.readyState)) {
    console.log("No connection to close.");
    return;
  }

  try {
    await mongoose.connection.close();
    console.log("Database disconnected successfully.");
  } catch (err) {
    console.error("Error disconnecting from database:", err);
    throw err;
  }
}

export async function getClient(): Promise<mongoose.mongo.MongoClient> {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if ([0, 3, 99].includes(mongoose.connection.readyState)) {
    await connect();
  }

  return mongoose.connection.getClient();
}
