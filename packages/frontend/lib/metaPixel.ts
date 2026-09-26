// src/lib/metaPixel.ts

export const META_PIXEL_ID =
    process.env.NEXT_PUBLIC_META_PIXEL_ID || "2145654692695858";

type MetaPixelParams = Record<string, unknown>;

declare global {
    interface Window {
        fbq?: (
            action: "track" | "trackCustom",
            eventName: string,
            params?: MetaPixelParams,
            options?: {
                eventID?: string;
            }
        ) => void;
    }
}

/**
 * Check if Meta Pixel is available.
 */
const isPixelAvailable = (): boolean => {
    return typeof window !== "undefined" && typeof window.fbq === "function";
};

/**
 * Generate an event ID.
 *
 * Very useful later when you add Meta Conversions API
 * because Browser Pixel + Server CAPI can use the same ID
 * for deduplication.
 */
export const generateEventId = (prefix = "event"): string => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return `${prefix}_${crypto.randomUUID()}`;
    }

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 10)}`;
};

/**
 * PageView
 */
export const pageView = () => {
    if (!isPixelAvailable()) return;

    window.fbq!("track", "PageView");
};

/**
 * ViewContent
 *
 * Use when a user opens a product.
 */
export interface ViewContentParams {
    id: string | number;
    name: string;
    price: number;
    category?: string;
}

export const viewContent = ({
    id,
    name,
    price,
    category,
}: ViewContentParams) => {
    if (!isPixelAvailable()) return;

    const eventId = generateEventId("view_content");

    window.fbq!(
        "track",
        "ViewContent",
        {
            content_ids: [String(id)],
            content_name: name,
            content_type: "product",
            content_category: category,
            value: Number(price),
            currency: "DZD",
        },
        {
            eventID: eventId,
        }
    );

    return eventId;
};

/**
 * AddToCart
 */
export interface AddToCartParams {
    id: string | number;
    name: string;
    price: number;
    quantity?: number;
}

export const addToCart = ({
    id,
    name,
    price,
    quantity = 1,
}: AddToCartParams) => {
    if (!isPixelAvailable()) return;

    const eventId = generateEventId("add_to_cart");

    window.fbq!(
        "track",
        "AddToCart",
        {
            content_ids: [String(id)],
            content_name: name,
            content_type: "product",

            contents: [
                {
                    id: String(id),
                    quantity,
                    item_price: Number(price),
                },
            ],

            value: Number(price) * quantity,
            currency: "DZD",
        },
        {
            eventID: eventId,
        }
    );

    return eventId;
};

/**
 * InitiateCheckout
 */
export interface CheckoutItem {
    id: string | number;
    price: number;
    quantity: number;
}

export interface InitiateCheckoutParams {
    items: CheckoutItem[];
    total: number;
}

export const initiateCheckout = ({
    items,
    total,
}: InitiateCheckoutParams) => {
    if (!isPixelAvailable()) return;

    const eventId = generateEventId("checkout");

    window.fbq!(
        "track",
        "InitiateCheckout",
        {
            content_ids: items.map((item) => String(item.id)),

            contents: items.map((item) => ({
                id: String(item.id),
                quantity: item.quantity,
                item_price: Number(item.price),
            })),

            content_type: "product",

            num_items: items.reduce(
                (sum, item) => sum + item.quantity,
                0
            ),

            value: Number(total),
            currency: "DZD",
        },
        {
            eventID: eventId,
        }
    );

    return eventId;
};

/**
 * Purchase
 *
 * IMPORTANT:
 * Call this ONLY after the order has been
 * successfully created.
 */
export interface PurchaseParams {
    orderId: string | number;
    items: CheckoutItem[];
    total: number;
}

export const purchase = ({
    orderId,
    items,
    total,
}: PurchaseParams) => {
    if (!isPixelAvailable()) return;

    // This is intentionally predictable.
    // Later NestJS can use exactly the same event ID
    // when sending Purchase through Conversions API.
    const eventId = `purchase_${orderId}`;

    window.fbq!(
        "track",
        "Purchase",
        {
            content_ids: items.map((item) => String(item.id)),

            contents: items.map((item) => ({
                id: String(item.id),
                quantity: item.quantity,
                item_price: Number(item.price),
            })),

            content_type: "product",

            num_items: items.reduce(
                (sum, item) => sum + item.quantity,
                0
            ),

            value: Number(total),
            currency: "DZD",
        },
        {
            eventID: eventId,
        }
    );

    return eventId;
};