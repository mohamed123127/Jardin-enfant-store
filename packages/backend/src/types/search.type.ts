type SearchFieldOperator = 'ilike' | 'equal';

export type SearchField<Entity> = {
    field: keyof Entity;
    operator: SearchFieldOperator;
}