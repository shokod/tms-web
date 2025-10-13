/**
 * Category mapping utility for projects
 * In the future, this should be replaced with a proper database field
 */

export type ProjectCategory = 
  | 'Development'
  | 'Design'
  | 'Marketing'
  | 'Consulting'
  | 'Research'
  | 'Support'
  | 'Training'
  | 'Other';

/**
 * Maps project names to categories based on keywords
 * This is a temporary solution until category is added to the database
 */
export const getProjectCategory = (projectName: string): ProjectCategory => {
  const name = projectName.toLowerCase();
  
  // Development keywords
  if (name.includes('app') || name.includes('system') || name.includes('api') || 
      name.includes('web') || name.includes('mobile') || name.includes('software') ||
      name.includes('platform') || name.includes('integration') || name.includes('auth')) {
    return 'Development';
  }
  
  // Design keywords
  if (name.includes('design') || name.includes('ui') || name.includes('ux') || 
      name.includes('brand') || name.includes('visual') || name.includes('mockup')) {
    return 'Design';
  }
  
  // Marketing keywords
  if (name.includes('marketing') || name.includes('campaign') || name.includes('seo') ||
      name.includes('social') || name.includes('content') || name.includes('advertising')) {
    return 'Marketing';
  }
  
  // Consulting keywords
  if (name.includes('consulting') || name.includes('strategy') || name.includes('analysis') ||
      name.includes('audit') || name.includes('review') || name.includes('assessment')) {
    return 'Consulting';
  }
  
  // Research keywords
  if (name.includes('research') || name.includes('study') || name.includes('survey') ||
      name.includes('analysis') || name.includes('investigation')) {
    return 'Research';
  }
  
  // Support keywords
  if (name.includes('support') || name.includes('maintenance') || name.includes('help') ||
      name.includes('troubleshoot') || name.includes('fix')) {
    return 'Support';
  }
  
  // Training keywords
  if (name.includes('training') || name.includes('workshop') || name.includes('course') ||
      name.includes('education') || name.includes('learning')) {
    return 'Training';
  }
  
  // Default fallback
  return 'Other';
};

/**
 * Get all available categories
 */
export const getAllCategories = (): ProjectCategory[] => {
  return [
    'Development',
    'Design', 
    'Marketing',
    'Consulting',
    'Research',
    'Support',
    'Training',
    'Other'
  ];
};

/**
 * Get category color for UI display
 */
export const getCategoryColor = (category: ProjectCategory): string => {
  const colors: Record<ProjectCategory, string> = {
    'Development': 'bg-blue-100 text-blue-800',
    'Design': 'bg-purple-100 text-purple-800',
    'Marketing': 'bg-green-100 text-green-800',
    'Consulting': 'bg-orange-100 text-orange-800',
    'Research': 'bg-indigo-100 text-indigo-800',
    'Support': 'bg-yellow-100 text-yellow-800',
    'Training': 'bg-pink-100 text-pink-800',
    'Other': 'bg-gray-100 text-gray-800'
  };
  
  return colors[category] || colors['Other'];
};
