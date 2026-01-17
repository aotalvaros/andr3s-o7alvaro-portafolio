/*
    Genera un color aleatorio en formato con unos colores expecificos del archivo globals.css
*/
export const getRandomColor = (): string => {
    const colors = [
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
        "var(--chart-6)",
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

