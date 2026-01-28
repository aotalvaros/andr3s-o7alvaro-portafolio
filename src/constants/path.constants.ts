
export const paths = (value: string) => {
    const path: Record<string, string> = {
        "/lab/mars-rover": "nasaGallery",
        "/lab/asteroids": "nasaAsteroid",
        "/lab/pokemon": "pokemonGallery",
        "/lab/weather": "weather",
        "/contact": "contact",
        "/login": "login",
    };

    return path[value] || "default";
}
