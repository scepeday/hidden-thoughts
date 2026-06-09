export const cinematicEase = [0.22, 1, 0.36, 1];

export const viewportOnce = {
  once: true,
  amount: 0.35,
};

export const introFade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 1.8,
      ease: cinematicEase,
    },
  },
};

export const sectionFade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 1.1,
      ease: cinematicEase,
    },
  },
};

export const softReveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: cinematicEase,
    },
  },
};

export const driftReveal = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: cinematicEase,
    },
  },
};

export const noteReveal = {
  hidden: (index = 0) => ({
    opacity: 0,
    y: 30,
    rotate: index % 2 === 0 ? -1.2 : 1.2,
  }),
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    rotate: index % 2 === 0 ? -0.4 : 0.4,
    transition: {
      duration: 0.95,
      delay: index * 0.07,
      ease: cinematicEase,
    },
  }),
};

export const menuPanel = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: cinematicEase,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.99,
    transition: {
      duration: 0.22,
      ease: cinematicEase,
    },
  },
};

export function reducedMotionProps(shouldReduceMotion) {
  if (!shouldReduceMotion) {
    return {};
  }

  return {
    initial: false,
    animate: false,
    whileInView: undefined,
    transition: { duration: 0 },
  };
}
