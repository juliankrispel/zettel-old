function createUID(): string {
  const firstPartNum = (Math.random() * 46656) | 0
  const secondPartNum = (Math.random() * 46656) | 0
  const firstPart = ('000' + firstPartNum.toString(36)).slice(-3)
  const secondPart = ('000' + secondPartNum.toString(36)).slice(-3)
  return firstPart + secondPart
}

export default createUID
