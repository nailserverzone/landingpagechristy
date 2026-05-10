export async function launchConfetti() {
  const confetti = (await import('canvas-confetti')).default;
  confetti({
    particleCount: 140,
    spread: 90,
    origin: { y: 0.5 },
    colors: ['#F9C5C5', '#B8DCEA', '#FCD34D', '#A855F7', '#60A5FA', '#34D399'],
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.6 },
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.6 },
    });
  }, 250);
}
