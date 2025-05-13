'use client';

import { motion } from 'framer-motion';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly asteroid: any;
  readonly onClick: () => void;
}

export function AsteroidCard({ asteroid, onClick }: Props) {
  const estimatedDiameter = asteroid?.estimated_diameter?.kilometers;
  const approachData = asteroid?.close_approach_data?.[0];

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-4 rounded-xl border shadow bg-background text-foreground cursor-pointer transition"
      onClick={onClick}
    >
      <h3 className="text-lg font-bold mb-2">{asteroid.name}</h3>
      <p className="text-sm text-muted-foreground">
        Tamaño: {estimatedDiameter?.estimated_diameter_max?.toFixed(2)} km
      </p>
      <p className="text-sm text-muted-foreground">
        Fecha de aproximación: {approachData?.close_approach_date ?? 'N/A'}
      </p>
      {asteroid.is_potentially_hazardous_asteroid && (
        <p className="text-red-500 font-semibold text-sm mt-2">¡Potencialmente peligroso!</p>
      )}
    </motion.div>
  );
}
