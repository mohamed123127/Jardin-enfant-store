import ProductDetailWrapper from "./ProductDetailWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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