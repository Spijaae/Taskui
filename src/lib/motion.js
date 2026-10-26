export const springPop = {
  type: "spring",
  stiffness: 380,
  damping: 18,
  mass: 0.85,
};
export const springSnappy = {
  type: "spring",
  stiffness: 460,
  damping: 24,
  mass: 0.7,
};
export const fadeQuick = {
  duration: 0.18,
  ease: [0.32, 0.72, 0, 1],
};
export const popInVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 12,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 6,
  },
};
