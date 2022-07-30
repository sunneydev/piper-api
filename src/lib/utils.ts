export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
};

export const groupByProperty = <T extends { [key: string]: any }>(
    array: T[],
    key: keyof T
): T[][] => {
    const elements: T[][] = [];
    let li = 0;

    for (let i = 0; i < array.length; i++) {
        if (!i) {
            elements[li] = [];
            // @ts-ignore
        } else if (array[i - 1][key] !== array[i][key]) {
            li++;
            elements[li] = [];
        }


        // @ts-ignore
        elements[li].push(array[i]);
    }

    return elements;
};
