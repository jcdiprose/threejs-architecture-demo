export default function ifDebugDo(callback: () => void) {
  if (import.meta.env.VITE_DEBUG === "true") callback()
}
