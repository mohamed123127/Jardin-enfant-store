import ProductDetailWrapper from "./ProductDetailWrapper";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return (
        <ProductDetailWrapper productId={id} />
    );
}