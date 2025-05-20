import { RoverFilters } from "@/components/nasa/mars-rover/RoverFilters";


export default function MarsRoverPage() {
  return (
    <main className="py-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          📸 Imágenes desde Marte
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explora las fotografías tomadas por los rovers de la NASA en la superficie de Marte.
          Elige el rover y la cámara para ver imágenes reales del planeta rojo.
        </p>
      </div>

      <RoverFilters />
    </main>
  )
}
