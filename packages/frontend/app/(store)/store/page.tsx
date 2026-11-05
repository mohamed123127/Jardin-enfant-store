// ISR: Next.js regenerates this page at most once every 60 s.
// On the hosted site the first visitor gets an already-rendered HTML page
// (no waiting for JS + hydration + API call), and the cache is kept warm
// for every subsequent visitor within that window.
export const revalidate = 60;

import { StoreClientView } from "@/components/store/StoreClientView";
import { StoreProduct } from "@/data/fakeProducts";
import { PaginationMetaData } from "@aio/shared";

interface StorePageProps {
    searchParams?: Promise<{
        page?: string;
        limit?: string;
    }>;
}

/** Fetch the paginated product listing server-side so the page is pre-rendered with data. */
async function fetchInitialProducts(page = 1, limit = 12): Promise<{
    data: StoreProduct[];
    meta: PaginationMetaData;
}> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return { data: [], meta: null };

        // GET is cacheable and parametrized by page and limit
        const res = await fetch(`${apiUrl}products?page=${page}&limit=${limit}`, {
            next: { revalidate },
        });

        if (!res.ok) return { data: [], meta: null };

        const json = await res.json();
        return {
            data: (json.data as StoreProduct[]) ?? [],
            meta: (json.meta as PaginationMetaData) ?? null,
        };
    } catch {
        // If the backend is unreachable during build/revalidation, return an
        // empty list so the page still renders — the client hook will retry.
        return { data: [], meta: null };
    }
}

export default async function StorePage({ searchParams }: StorePageProps) {
    const resolvedParams = searchParams ? await searchParams : {};
    const page = Math.max(1, Number(resolvedParams?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(resolvedParams?.limit) || 12));

    const { data: initialProducts, meta: initialMeta } = await fetchInitialProducts(page, limit);

    return (
        <StoreClientView
            initialProducts={initialProducts}
            initialMeta={initialMeta}
            initialPage={page}
            initialLimit={limit}
        />
    );
}