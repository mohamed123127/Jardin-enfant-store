export class StringFormatter {
    static formatEntityName(entityName: string): string {
        return entityName
            .replace(/_/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }
}