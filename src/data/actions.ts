export const saveToken = (token: string) => {
  const tokenParts = token.split('.')
  let payload = 'c' + tokenParts[1] + 'o'
  localStorage.setItem('token', `${tokenParts[0]}.${payload}.${tokenParts[2]}`)
}

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (token){
    const tokenParts = token.split('.')
    let payload = tokenParts[1].substring(1, tokenParts[1].length - 1)
    return `${tokenParts[0]}.${payload}.${tokenParts[2]}`
  } else return ''
}