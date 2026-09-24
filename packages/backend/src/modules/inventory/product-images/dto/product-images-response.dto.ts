export type ProductImageResponseDto = {
    id: number;

    productId: string;

    url: string;

    alt?: string;

    position: number;
};

export type ProductImageSummaryDto = {
    id: number;

    productId: string;

    url: string;

    position: number;
};