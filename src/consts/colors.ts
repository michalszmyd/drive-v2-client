export const colors = {
  main: '#6D50F2',
  secondary: '#C550F2',
  white: '#fff',
  darkWhite: '#fafafa',
  green: '#57EB68',
  gray: '#eee',
}

export const light = {
  href: '#0c0c0c',
  background: '#eaeaea',
  backgroundSecondary: '#ddd',
  textColor: '#0c0c0c',
  linkColor: colors.main,
}

export const dark = {
  background: '#181818',
  href: '#fff',
  backgroundSecondary: '#121212',
  textColor: '#e9e9e9',
  linkColor: colors.secondary,
}

export enum Theme {
  Dark = 'dark',
  Light = 'light',
}

export const resolveThemeColor = (theme : Theme) => {
  const selectedTheme = theme === Theme.Dark ? dark : light;

  return selectedTheme;
}
