"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    limit,
    onPageChange,
    onLimitChange,
    isLoading = false,
}) => {
    if (totalPages <= 1 && totalItems <= limit) {
        return null;
    }

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalItems);

    /** Generate list of visible page numbers with ellipsis */
    const getPageNumbers = (): (number | string)[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];

        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1);
            pages.push("...");
            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push("...");
            pages.push(currentPage - 1);
            pages.push(currentPage);
            pages.push(currentPage + 1);
            pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 pb-4 border-t border-zinc-200/80 dark:border-zinc-800">
            {/* Pagination Controls */}
            <div className="flex items-center w-full justify-center gap-1.5 sm:gap-2">
                {/* Previous Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    aria-label="Page précédente"
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    <FiChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {pages.map((p, idx) => {
                        if (p === "...") {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="w-8 text-center text-xs text-zinc-400 dark:text-zinc-500"
                                >
                                    …
                                </span>
                            );
                        }

                        const pageNum = Number(p);
                        const isActive = pageNum === currentPage;

                        return (
                            <button
                                key={pageNum}
                                type="button"
                                onClick={() => onPageChange(pageNum)}
                                disabled={isLoading || isActive}
                                aria-current={isActive ? "page" : undefined}
                                className={`min-w-9 h-9 px-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 cursor-default"
                                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm"
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    aria-label="Page suivante"
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    <FiChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

