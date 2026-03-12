export const calculateCommission = (amount: number, percentage: number = 0.1): number => {
    return Number((amount * percentage).toFixed(2));
};

export const getNetAmount = (amount: number, commission: number): number => {
    return Number((amount - commission).toFixed(2));
};
