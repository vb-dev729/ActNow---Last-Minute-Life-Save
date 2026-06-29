import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function AmbientStarfield({ speedUp = false }: { speedUp?: boolean }) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate randomized position coordinates for 30 ambient drifting background stars
    const initialStars = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage-based
      y: Math.random() * 100, // percentage-based
      size: Math.random() * 2.5 + 0.5, // sizes from 0.5px to 3px
      duration: Math.random() * 8 + 6, // 6s to 14s loops
      delay: Math.random() * 4, // delay of entry
    }));
    setStars(initialStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => {
        const adjustedDuration = speedUp ? star.duration / 3.5 : star.duration;
        const starColor = speedUp ? 'bg-rose-400/60' : 'bg-violet-400/40';
        
        return (
          <motion.div
            key={star.id}
            className={`absolute rounded-full ${starColor}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: star.size > 1.8 ? (speedUp ? '0 0 10px rgba(239, 68, 68, 0.8)' : '0 0 8px rgba(139, 92, 246, 0.6)') : 'none',
            }}
            animate={{
              y: speedUp ? [0, -60, 0] : [0, -30, 0],
              opacity: [0.15, 0.8, 0.15],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: adjustedDuration,
              repeat: Infinity,
              delay: speedUp ? 0 : star.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Floating larger auroral orbs in background */}
      <motion.div
        className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -40, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
