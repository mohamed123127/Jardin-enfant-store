export type Filter<T> = {
    key: keyof T | 'searchText';
    value: string;
    type?: "default" | "fixed";
    operator?: "=" | ">" | "<" | ">=" | "<=" | "!=" | "between" | "not between" | "like" | "not like" | "in" | "not in";
};
