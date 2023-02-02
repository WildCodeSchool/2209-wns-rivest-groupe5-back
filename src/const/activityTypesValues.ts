import {
  activityTypeLabel,
  activityTypeName,
} from "../interfaces/entities/ActivityTypesTypesValues";

export const ACTIVITY_TYPES = {
  transport: {
    id: 1,
    name: activityTypeName.transport,
    label: activityTypeLabel.Transport,
    emoji: "🚗",
    backgroundColor: "#f9ca24",
  },
  numeric: {
    id: 2,
    name: activityTypeName.numeric,
    label: activityTypeLabel.Numerique,
    emoji: "💻",
    backgroundColor: "#f0932b",
  },
  food: {
    id: 3,
    name: activityTypeName.food,
    label: activityTypeLabel.Alimentation,
    emoji: "🍕",
    backgroundColor: "#eb4d4b",
  },
  energy: {
    id: 4,
    name: activityTypeName.energy,
    label: activityTypeLabel.Energie,
    emoji: "⚡",
    backgroundColor: "#6ab04c",
  },
  appliance: {
    id: 5,
    name: activityTypeName.appliance,
    label: activityTypeLabel.Electromenager,
    emoji: "🚿",
    backgroundColor: "#7ed6df",
  },
  other: {
    id: 6,
    name: activityTypeName.other,
    label: activityTypeLabel.Autre,
    emoji: "🤷‍♂️",
    backgroundColor: "#686de0",
  },
};
