/**
 * Safe Web Haptics / Vibration Engine for NyayaPath
 * Gracefully degrades on devices / browsers without Vibration API support.
 */

export type HapticPreset = 'selection' | 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const HAPTIC_PATTERNS: Record<HapticPreset, number | number[]> = {
  selection: 10,              // Subtle 10ms click for chips, tabs, theme switches
  light: 20,                  // 20ms gentle tap
  medium: 40,                 // 40ms affirmative button actuation
  heavy: 70,                  // 70ms pronounced haptic feedback
  success: [30, 50, 40],      // Cheerful rhythmic double pulse (copy, generate)
  warning: [50, 60, 50],      // Alerting double vibration (physical threat)
  error: [80, 50, 80, 50, 100] // Urgent triple buzz (network or validation failure)
};

export function triggerHaptic(presetOrPattern: HapticPreset | number | number[] = 'selection'): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  
  if (!('vibrate' in navigator) || typeof navigator.vibrate !== 'function') {
    return false;
  }

  try {
    const pattern = typeof presetOrPattern === 'string'
      ? HAPTIC_PATTERNS[presetOrPattern] ?? 15
      : presetOrPattern;
      
    return navigator.vibrate(pattern);
  } catch {
    // Fail silently without disrupting user interaction
    return false;
  }
}

export const haptic = {
  selection: () => triggerHaptic('selection'),
  light: () => triggerHaptic('light'),
  medium: () => triggerHaptic('medium'),
  heavy: () => triggerHaptic('heavy'),
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
};
