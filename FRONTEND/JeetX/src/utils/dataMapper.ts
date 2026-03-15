
export interface StandardGameItem {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  [key: string]: any; // Allow for extra fields
}

/**
 * Maps varying API response items to a standard game item structure.
 * This ensures the UI remains decoupled from the specific API response format.
 */
export const mapToStandardGameItem = (item: any): StandardGameItem => {
  return {
    id: item.id || item._id || item.uuid || '',
    title: item.title || item.name || item.heading || 'Unnamed Game',
    description: item.description || item.desc || item.subtitle || '',
    icon: item.icon_url || item.iconUrl || item.imageUrl || item.icon || null,
    // Pass everything else through just in case
    ...item,
  };
};

/**
 * Maps a list of varied items to a list of standard game items.
 */
export const mapToStandardGameItems = (items: any[]): StandardGameItem[] => {
  if (!Array.isArray(items)) return [];
  return items.map(mapToStandardGameItem);
};
