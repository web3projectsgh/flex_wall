"use client";
import { useEffect } from "react";
import MurDeRichesse from "../components/MurDeRichesse";

export default function Home() {
  useEffect(() => {
    fetch("/api/run?run=script")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Erreur:", error));
  }, []);

  return <MurDeRichesse />;
}
