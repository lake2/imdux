export function getRootState<T>(payload: any): T {
    return (payload as any).rootState;
}
