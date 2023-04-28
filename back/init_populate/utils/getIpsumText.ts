const getIpsumText = (numWords: number): string => {
  const words = [
    'Lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
  ]

  let ipsum = ''
  for (let i = 0; i < numWords; i++) {
    ipsum += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return ipsum.trim()
}
export default getIpsumText
