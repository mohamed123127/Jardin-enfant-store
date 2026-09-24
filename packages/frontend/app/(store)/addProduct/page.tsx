import AddProductView from "@/components/store/AddProductView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion des Produits & Variantes | Jardin d'Enfants",
  description: "Ajoutez et configurez les couleurs, tailles et stocks de vos produits.",
};

export default function AddProductPage() {
  return <AddProductView />;
}
