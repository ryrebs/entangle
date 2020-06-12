import React, { useEffect, useState } from "react";
import * as eva from "@eva-design/eva";
import { AuthContext } from "./AuthContextProvider";

export const ThemeContext = React.createContext({
  setTheme: () => {},
  theme: eva.dark,
});

interface ThemeProps {
  children: any;
}

export default (props: ThemeProps) => {
  const [propsState, setProps] = useState<any | null>(null);
  const [theme, setTheme] = React.useState(eva.dark);

  const setEvaTheme = React.useCallback(() => {
    setTheme((t) => {
      const newTheme = t === eva.dark ? eva.light : eva.dark;
      return newTheme;
    });
  }, [setTheme, theme]);

  useEffect(() => {
    setProps(props.children);
  }, [propsState]);

  return (
    <ThemeContext.Provider value={{ setTheme: setEvaTheme, theme: theme }}>
      {propsState}
    </ThemeContext.Provider>
  );
};
