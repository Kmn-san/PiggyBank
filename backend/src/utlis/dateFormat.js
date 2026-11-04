export const isRealDate = (s) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s ?? '')) return false
    const d = new Date(`${s}T00:00:00Z`)
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s   // rejects 2026-02-31
}