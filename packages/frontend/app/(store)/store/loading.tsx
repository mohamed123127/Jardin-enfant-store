import React from "react";

export default function StoreLoading() {
    return (
        <div className="min-h-screen flex flex-col bg-zinc-50/70 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col items-center justify-center py-28 sm:py-36">
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-100 dark:border-amber-900/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
                </div>
                <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
                    Chargement des produits…
                </p>
            </main>
        </div>
    );
}

