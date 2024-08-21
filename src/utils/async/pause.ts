export default function pause(time: number) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}
