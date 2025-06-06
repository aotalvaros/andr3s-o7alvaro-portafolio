
export const paths = (value: string) => {
    const path: Record<string, string> = {
        "/lab/mars-rover": "nasaGallery",
        "/lab/asteroids": "nasaAsteroid",
        "/contact": "contact",
        "/login": "login",
    };

    return path[value] || "default";
}
