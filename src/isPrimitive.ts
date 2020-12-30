export function isPrimitive(val: string) {
    if (typeof val === 'object') {
        return val === null;
    }
    return typeof val !== 'function';
}
