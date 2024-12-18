import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

const AnimatedEqualizer = ({ barCount = 20, color = '#4CAF50' }) => {
  const bars: any = useRef([]);

  useEffect(() => {
    bars.current = Array(barCount)
      //@ts-ignore
      .fill()
      .map(() => ({
        baseHeight: 5 + Math.random() * 15,
        maxHeight: 60 + Math.random() * 40,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      }));
  }, [barCount]);

  const props = useSpring({
    from: { t: 0 },
    to: { t: 2 * Math.PI },
    loop: true,
    config: { duration: 5000 },
  });

  return (
    <div className='flex w-full bg-black items-end justify-center h-20 space-x-[1px]'>
      {bars.current.map((bar: any, index: number) => (
        <animated.div
          key={index}
          style={{
            width: `${20 / barCount}%`,
            height: props.t.to((t: any) => {
              const wave1 = Math.sin(t * bar.speed + bar.phase);
              const wave2 = Math.sin(t * bar.speed * 1.5 + bar.phase);
              const combinedWave = (wave1 + wave2) / 2;
              const normalizedHeight = (combinedWave + 1) / 2;
              return `${bar.baseHeight + normalizedHeight * (bar.maxHeight - bar.baseHeight)}%`;
            }),
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedEqualizer;
