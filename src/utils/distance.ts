import { LocationCoordinates, Resource, ResourceType } from '../types/emergency';

/**
 * Calculates straight line distance in km between two lat/lng coordinates (Haversine formula)
 */
export function calculateDistanceKm(
  coord1: LocationCoordinates,
  coord2: LocationCoordinates
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

export interface ScoredResource {
  resource: Resource;
  distanceKm: number;
  isTypeMatch: boolean;
  score: number; // Higher is better recommendation
}

/**
 * Sorts and scores resources based on proximity, availability, and incident type matching
 */
export function rankRecommendedResources(
  incidentLocation: LocationCoordinates,
  incidentRequiredType: ResourceType,
  resources: Resource[]
): ScoredResource[] {
  return resources
    .map((resource) => {
      const distance = calculateDistanceKm(incidentLocation, resource.location);
      const isTypeMatch = resource.type === incidentRequiredType;

      // Scoring factors:
      // Availability is paramount: AVAILABLE = +100, DEPLOYED = -50, BUSY = -100
      // Type match: +40
      // Distance: -2 points per km
      let score = 0;
      if (resource.status === 'AVAILABLE') score += 100;
      else if (resource.status === 'DEPLOYED') score += 20;
      else score -= 50;

      if (isTypeMatch) score += 40;
      score -= distance * 3;

      return {
        resource,
        distanceKm: distance,
        isTypeMatch,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);
}
