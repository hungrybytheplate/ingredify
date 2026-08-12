import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thekitchenhq.app',
  appName: 'Ingredify',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
    scheme: 'Ingredify',
    limitsNavigationsToAppBoundDomains: false,
    // Use 'always' to allow the WebView to scroll its content under the safe area
    // Set to false in production to prevent zoom on input focus
    preferredContentMode: 'mobile',
  },
};

export default config;
