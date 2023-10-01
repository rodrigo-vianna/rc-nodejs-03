export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  let distInKm =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  if (distInKm > 1) {
    distInKm = 1
  }

  distInKm = Math.acos(distInKm)
  distInKm = (distInKm * 180) / Math.PI
  distInKm = distInKm * 60 * 1.1515
  distInKm = distInKm * 1.609344

  return distInKm
}
