export const getMonthRange = (month) => {
    const selectedMonth =
        month ?? new Date().toISOString().slice(0, 7);

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(selectedMonth)) {
        const error = new Error("Invalid month format. Use YYYY-MM.");
        error.statusCode = 400;
        throw error;
    }

    const monthStart = `${selectedMonth}-01`;

    const [year, monthNumber] = selectedMonth.split("-").map(Number);

    const nextMonthStart = new Date(
        Date.UTC(year, monthNumber, 1)
    ).toISOString().slice(0, 10);

    return {
        selectedMonth,
        monthStart,
        nextMonthStart
    };
};