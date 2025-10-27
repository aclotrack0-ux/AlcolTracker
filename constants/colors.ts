export const colors = {
  light: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFD93D',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#2D3436',
    textSecondary: '#636E72',
    border: '#DFE6E9',
    error: '#E74C3C',
    success: '#00B894',
    warning: '#FDCB6E',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFD93D',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#F8F9FA',
    textSecondary: '#B2BEC3',
    border: '#3D3D3D',
    error: '#E74C3C',
    success: '#00B894',
    warning: '#FDCB6E',
    card: '#2D2D2D',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const getBACColor = (bac: number): string => {
  if (bac < 0.2) return '#00B894'; // Green - Sober
  if (bac < 0.5) return '#55EFC4'; // Light green
  if (bac < 0.8) return '#FDCB6E'; // Yellow - Mild
  if (bac < 1.5) return '#FF9F43'; // Orange - Moderate
  if (bac < 2.5) return '#EE5A6F'; // Red - High
  return '#E74C3C'; // Dark red - Dangerous
};