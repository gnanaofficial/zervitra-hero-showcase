// Centralized color configuration for Zervitra
// Change colors here to update the entire design system

export const colors = {
  // Primary brand colors
  primary: {
    main: "263 70% 50%", // Purple
    light: "263 70% 60%",
    dark: "263 70% 40%",
  },

  // Hero gradient colors
  hero: {
    from: "263 70% 60%", // Light purple
    to: "240 70% 65%", // Blue
  },

  // Success/Green colors
  success: {
    main: "142 76% 36%", // Green
    light: "142 76% 46%",
    dark: "142 76% 26%",
  },

  // Background colors
  background: {
    main: "222 22% 4%", // Dark background
    card: "222 20% 8%", // Card background
    secondary: "222 15% 12%", // Secondary background
  },

  // Text colors
  text: {
    primary: "210 40% 98%", // White text
    secondary: "215.4 16.3% 65%", // Secondary text
    muted: "215.4 16.3% 55%", // Muted text
  },

  // Border colors
  border: {
    main: "222 15% 15%",
    light: "222 15% 20%",
    primary: "263 70% 50%",
  },

  // Shadow colors
  shadow: {
    card: "0 10px 30px -10px hsl(222 22% 2% / 0.5)",
    button: "0 8px 25px -8px hsl(263 70% 50% / 0.4)",
    glow: "0 0 40px hsl(142 76% 36% / 0.3)",
  },
};

// CSS Custom Properties for easy use in components
export const cssVariables = `
  :root {
    --primary: ${colors.primary.main};
    --primary-light: ${colors.primary.light};
    --primary-dark: ${colors.primary.dark};
    
    --hero-from: ${colors.hero.from};
    --hero-to: ${colors.hero.to};
    
    --success: ${colors.success.main};
    --success-light: ${colors.success.light};
    --success-dark: ${colors.success.dark};
    
    --background: ${colors.background.main};
    --card: ${colors.background.card};
    --secondary: ${colors.background.secondary};
    
    --foreground: ${colors.text.primary};
    --nav-text: ${colors.text.secondary};
    --subtext: ${colors.text.muted};
    
    --border: ${colors.border.main};
    --border-light: ${colors.border.light};
    --border-primary: ${colors.border.primary};
    
    --shadow-card: ${colors.shadow.card};
    --shadow-button: ${colors.shadow.button};
    --shadow-glow: ${colors.shadow.glow};
  }
`;

export default colors;
