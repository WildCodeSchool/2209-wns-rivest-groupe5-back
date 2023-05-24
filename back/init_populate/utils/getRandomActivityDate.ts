export const getRandomActivityDate = (): Date => {
  // renvoie une date aléatoire dans les 365 derniers jours
  const currentDate = new Date()
  const startDate = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000) // Soustraire 365 jours en millisecondes
  const startTime = startDate.getTime()
  const randomTime =
    startTime + Math.random() * (currentDate.getTime() - startTime) // Obtenir un timestamp aléatoire entre la date de début et la date actuelle

  const randomDate = new Date(randomTime)

  return randomDate
}
