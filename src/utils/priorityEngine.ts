import { IncidentType, SeverityLevel, PriorityLevel, ResourceType } from '../types/emergency';

export interface PriorityAssessment {
  priority: PriorityLevel;
  reason: string;
  recommendedResourceType: ResourceType;
}

/**
 * Prototype Priority Assessment Engine
 * Demonstrates deterministic AI prioritization based on multi-factor heuristics
 * without requiring real heavy ML inference.
 */
export function assessIncidentPriority(
  type: IncidentType,
  severity: SeverityLevel,
  _description?: string
): PriorityAssessment {
  // Determine standard recommended resource type
  let recommendedResourceType: ResourceType = 'Ambulance';
  switch (type) {
    case 'Medical Emergency':
      recommendedResourceType = 'Ambulance';
      break;
    case 'Fire':
      recommendedResourceType = 'Fire Unit';
      break;
    case 'Flood':
      recommendedResourceType = 'Volunteer Team';
      break;
    case 'Accident':
      recommendedResourceType = 'Police Unit';
      break;
    case 'Infrastructure Hazard':
      recommendedResourceType = 'Fire Unit';
      break;
    case 'Other':
    default:
      recommendedResourceType = 'Volunteer Team';
      break;
  }

  // Priority matrix logic
  if (severity === 'Critical') {
    if (type === 'Medical Emergency') {
      return {
        priority: 'CRITICAL',
        reason: 'Immediate life-threat detected. Zero-delay ALS (Advanced Life Support) response required.',
        recommendedResourceType: 'Ambulance',
      };
    }
    if (type === 'Fire') {
      return {
        priority: 'CRITICAL',
        reason: 'Structural flashover danger with active entrapment risk. Full suppression team needed.',
        recommendedResourceType: 'Fire Unit',
      };
    }
    if (type === 'Accident') {
      return {
        priority: 'CRITICAL',
        reason: 'Severe high-speed collision with critical casualties and perimeter hazards.',
        recommendedResourceType: 'Ambulance',
      };
    }
    return {
      priority: 'CRITICAL',
      reason: 'Critical severity event posing imminent hazard to human life and urban infrastructure.',
      recommendedResourceType,
    };
  }

  if (severity === 'High') {
    if (type === 'Fire') {
      return {
        priority: 'CRITICAL',
        reason: 'High thermal escalation risk. Priority perimeter containment and rapid suppression required.',
        recommendedResourceType: 'Fire Unit',
      };
    }
    if (type === 'Medical Emergency') {
      return {
        priority: 'HIGH',
        reason: 'Acute medical distress requiring urgent paramedic triage and transport.',
        recommendedResourceType: 'Ambulance',
      };
    }
    if (type === 'Flood') {
      return {
        priority: 'HIGH',
        reason: 'Water level surging with transit disruption and vulnerable resident exposure.',
        recommendedResourceType: 'Volunteer Team',
      };
    }
    if (type === 'Accident') {
      return {
        priority: 'HIGH',
        reason: 'Multi-lane traffic blockage with minor to moderate injuries needing stabilization.',
        recommendedResourceType: 'Police Unit',
      };
    }
    return {
      priority: 'HIGH',
      reason: 'Elevated threat level requiring prioritized agency intervention within standard response window.',
      recommendedResourceType,
    };
  }

  if (severity === 'Medium') {
    if (type === 'Infrastructure Hazard') {
      return {
        priority: 'MEDIUM',
        reason: 'Municipal utility failure or road blockage; scheduled dispatch recommended.',
        recommendedResourceType: 'Fire Unit',
      };
    }
    return {
      priority: 'MEDIUM',
      reason: 'Moderate operational incident with localized impact and stable perimeter.',
      recommendedResourceType,
    };
  }

  // Low severity
  return {
    priority: 'LOW',
    reason: 'Non-emergency advisory situation. Monitored for potential escalation.',
    recommendedResourceType,
  };
}
