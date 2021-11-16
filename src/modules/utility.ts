// eslint-disable-next-line no-unused-vars
interface forEachAsyncArgs<A, B> {
    callback(item: A, index?: number, array?: A[])
}
export const asyncForEach = async <A = any, B = any>(array: A[], callback: forEachAsyncArgs<A, B>["callback"]): Promise<B[]> => {
    try {
        const allPromises = array.map(async (item: A, index: number, array: A[]) => callback(item, index, array));
        return await Promise.all(allPromises);
    }
    catch (e) {
        throw e;
    }
};

export const parseBoolString = (value: string | boolean): boolean => {
    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }
    return value;
};
