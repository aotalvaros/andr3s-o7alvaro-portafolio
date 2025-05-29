
export const paths = (value: string) => {
    const path: Record<string, string> = {
        "/lab/mars-rover": "nasaGallery",
        "/lab": "nasaAsteroid"
    };

    return path[value] || "default";
}
