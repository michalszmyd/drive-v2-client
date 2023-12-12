function onScroll(onPageEndReceived: () => void, event: Event) {
  console.log({event});
}

export default function useScroll(onPageEndReceived: () => void) {
  const scrollFunction = (event: Event) => { onScroll(onPageEndReceived, event) };
  const event = document.addEventListener('scroll', scrollFunction);

  return [
    event,
    () => { document.removeEventListener('scroll', scrollFunction); }
  ]
}
