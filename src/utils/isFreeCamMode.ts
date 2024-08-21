export default function isFreeCamMode() {
  return import.meta.env.VITE_FREE_CAM === "true"
}
