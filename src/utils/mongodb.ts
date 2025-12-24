import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
let client: MongoClient;
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!uri) {
  throw new Error(
    "MONGODB_URI n'est pas défini dans les variables d'environnement"
  );
}

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri);
  globalWithMongo._mongoClientPromise = client.connect();
}
const clientPromise = globalWithMongo._mongoClientPromise; // <-- initialisation ici

export default clientPromise;
