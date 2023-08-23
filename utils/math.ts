export const median = (arr: number[]): number | undefined => {
    if (!arr.length) return undefined;
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? ((s[mid - 1] + s[mid]) / 2) : s[mid];
};

export function groupByFullYear<T>(items: any[], field = "closedAt") : { [key: string]: T[] } {
    return items.reduce((grouped, product) => {
        let group = new Date(product[field]).getFullYear();
        if(!grouped[group]) {
            grouped[group] = [];
        }

        grouped[group].push(product);

        return grouped;
    }, {} as { [key: string]: T[] })
}