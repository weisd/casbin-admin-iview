import { jws } from 'jsrsasign'

export const parseJWT = (token) => {
  return jws.JWS.parse(token)
}
