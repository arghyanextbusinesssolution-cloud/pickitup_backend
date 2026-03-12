export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US').format(date);
};

export const generateRandomId = (length: number = 8): string => {
    return Math.random().toString(36).substring(2, 2 + length);
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
