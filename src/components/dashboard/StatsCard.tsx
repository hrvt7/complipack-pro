import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color: 'blue' | 'green' | 'amber' | 'red';
  showProgress?: boolean;
  progressValue?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  delay?: number;
}

const colorClasses = {
  blue: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    progress: 'stroke-primary',
  },
  green: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    progress: 'stroke-emerald-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-500',
    progress: 'stroke-amber-500',
  },
  red: {
    bg: 'bg-destructive/10',
    icon: 'text-destructive',
    progress: 'stroke-destructive',
  },
};

function AnimatedNumber({ value, delay }: { value: number; delay: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      motionValue.set(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return <span>{displayValue}</span>;
}

function CircularProgress({ value, color, delay }: { value: number; color: string; delay: number }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const circumference = 2 * Math.PI * 18;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted/20"
        />
        <motion.circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className={color}
          style={{
            strokeDasharray: circumference,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (animatedValue / 100) * circumference }}
          transition={{ duration: 1, delay: delay / 1000, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {animatedValue}%
      </span>
    </div>
  );
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'neutral',
  color,
  showProgress,
  progressValue,
  action,
  delay = 0,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className={cn(
        "p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm",
        "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.bg)}>
            <Icon className={cn("h-6 w-6", colors.icon)} />
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn("text-3xl font-bold", color === 'red' && 'text-destructive')}>
              <AnimatedNumber value={value} delay={delay} />
            </p>
          </div>
          
          {change && (
            <p className={cn(
              "text-xs flex items-center gap-1",
              changeType === 'positive' && "text-emerald-500",
              changeType === 'negative' && "text-destructive",
              changeType === 'neutral' && "text-muted-foreground"
            )}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </p>
          )}

          {action && (
            <button
              onClick={action.onClick}
              className="text-sm text-destructive hover:underline font-medium"
            >
              {action.label} →
            </button>
          )}
        </div>

        {showProgress && progressValue !== undefined && (
          <CircularProgress value={progressValue} color={colors.progress} delay={delay} />
        )}
      </div>
    </motion.div>
  );
}
