import axios, { AxiosError } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status == HttpStatusCode.UnprocessableEntity
}

export function FormatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}
export function FormatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}
export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + '%'

export const removeSpecialCharacter = (str: string) =>
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<\>|\?|\/|\,|\.|\:|\;|\'|\"|\&|\$|\[|\]|\`|\~|_|\#|\-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i.${id}`
}
export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i.')
  return arr[arr.length - 1]
}
