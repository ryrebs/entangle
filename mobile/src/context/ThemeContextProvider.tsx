import React, { ReactChild } from "react";
import * as eva from "@eva-design/eva";

export const ThemeContext = React.createContext({
  setTheme: () => {},
  theme: eva.dark,
});

interface ThemeProps {
  children: ReactChild;
}

export default ({ children }: ThemeProps) => {
  const [theme, setTheme] = React.useState(eva.dark);

  const setEvaTheme = React.useCallback(() => {
    setTheme((t: string) => {
      const newTheme = t === eva.dark ? eva.light : eva.dark;
      return newTheme;
    });
  }, [setTheme, theme]);

  return (
    <ThemeContext.Provider value={{ setTheme: setEvaTheme, theme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
