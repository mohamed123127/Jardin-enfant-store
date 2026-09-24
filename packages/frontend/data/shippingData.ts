import wilayasRaw from './shippingDelevery/wilayas.json';
import communesRaw from './shippingDelevery/communes.json';
import agencesRaw from './shippingDelevery/agences.json';

export interface Wilaya {
  id: number;
  name: string;
  stopDeskTarif: number;
  homeTarif: number;
  is_deliverable: number;
}

export interface Commune {
  id: number;
  name: string;
  is_deliverable: number;
  has_stop_desk: number;
  wilaya_id: number;
}

export interface Agence {
  id: number;
  name: string;
  address: string;
  gps?: string;
  commune_id: number;
}

export const WILAYAS: Wilaya[] = (wilayasRaw as Wilaya[])
  .filter((w) => w.is_deliverable === 1)
  .sort((a, b) => a.id - b.id);

export const ALL_COMMUNES: Commune[] = communesRaw as Commune[];
export const ALL_AGENCES: Agence[] = agencesRaw as Agence[];

/**
 * Returns deliverable communes for a given wilayaId
 */
export function getCommunesForWilaya(wilayaId: number): Commune[] {
  return ALL_COMMUNES.filter(
    (c) => c.wilaya_id === wilayaId && c.is_deliverable === 1
  ).sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/**
 * Returns agences/stop desk offices for a given wilayaId and optional communeId
 */
export function getAgencesForWilayaOrCommune(wilayaId: number, communeId?: number): Agence[] {
  if (communeId) {
    const agencesForCommune = ALL_AGENCES.filter((a) => a.commune_id === communeId);
    if (agencesForCommune.length > 0) return agencesForCommune;
  }
  // Fallback: return all agences belonging to any commune in this wilaya
  const wilayaCommuneIds = new Set(getCommunesForWilaya(wilayaId).map((c) => c.id));
  return ALL_AGENCES.filter((a) => wilayaCommuneIds.has(a.commune_id));
}
