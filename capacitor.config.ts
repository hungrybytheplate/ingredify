import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thekitchenhq.app',
  appName: 'the-kitchen',
  webDir: 'dist',
  server: {
    url: 'the-kitchen.org',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
    scheme: 'TheKitchen',
    limitsNavigationsToAppBoundDomains: false,
    // Use 'always' to allow the WebView to scroll its content under the safe area
    // Set to false in production to prevent zoom on input focus
    preferredContentMode: 'mobile',
  },
};

export default config;
