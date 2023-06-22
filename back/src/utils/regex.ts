export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&#?_\-()\[\]=*$ù%])[A-Za-z\d&#?_\-()\[\]=*$ù%]{8,}$/

  return passwordRegex.test(password)
}
