declare global {
  interface Window {
    gtranslateSettings: {
      default_language: string;
      detect_browser_language: boolean;
      wrapper_selector: string;
      languages?: string[];
    };
  }
}