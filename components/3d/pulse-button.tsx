'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function PulseButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Button {...props}>{children}</Button>
    </motion.div>
  );
}
