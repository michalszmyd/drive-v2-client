export const colors = {
  main: "#6973d0",
  secondary: "#b0b6e7",
  white: "#fff",
  darkWhite: "#fafafa",
  green: "#57EB68",
  gray: "#eee",
  redDelete: "#EB234B",
  textBlack: "#0c0c0c",
  warning: "#EB9B13",
};

export const fileExtensionsColors: { [key: string]: string } = {
  png: "#F5D795",
  jpg: "#F5DAA7",
  jpeg: "#F5DAA7",
  webm: "#9BEB4B",
  jfif: "#F5A67B",
  mp4: "#76AFF5",
  m4a: "#67F580",
};

export type AppTheme = {
  href: string;
  background: string;
  backgroundSecondary: string;
  textColor: string;
  linkColor: string;
};

export const light: AppTheme = {
  href: "#0c0c0c",
  background: "#eef2f9",
  backgroundSecondary: "#F2F6FF",
  textColor: "#0c0c0c",
  linkColor: colors.main,
};

export const dark: AppTheme = {
  background: "#181818",
  href: "#fff",
  backgroundSecondary: "#121212",
  textColor: "#e9e9e9",
  linkColor: colors.secondary,
};

export enum Theme {
  Dark = "dark",
  Light = "light",
}

export const resolveThemeColor = (theme: Theme) => {
  const selectedTheme = theme === Theme.Dark ? dark : light;

  return selectedTheme;
};
