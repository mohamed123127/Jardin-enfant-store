import AddProductView from "@/components/store/AddProductView";
import { NOTFOUND } from "dns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion des Produits & Variantes | Jardin d'Enfants",
  description: "Ajoutez et configurez les couleurs, tailles et stocks de vos produits.",
};

export default function AddProductPage() {
  // return <AddProductView />;
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/">Go back home</a>
    </div>
  )
}
