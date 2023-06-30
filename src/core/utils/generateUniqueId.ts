export function generateUniqueId(): string {
  let timestamp = Date.now()
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (timestamp + Math.random() * 16) % 16 | 0
    timestamp = Math.floor(timestamp / 16)
    return (char === "x" ? random : (random & 0x3) | 0x8).toString(16)
  })
}
