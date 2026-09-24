export type AttributeValueResponseDto = {
    id: number;
    value: string;
};
export type AttributeResponseDto = {
    id: number;
    name: string;
    values?: AttributeValueResponseDto[];
};
export type AttributeSummaryDto = {
    id: number;
    name: string;
    values?: AttributeValueResponseDto[];
};
