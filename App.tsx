/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_900Black,
} from "@expo-google-fonts/roboto";
import {
  Comfortaa_400Regular,
  Comfortaa_500Medium,
} from "@expo-google-fonts/comfortaa";
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_600SemiBold,
  BarlowCondensed_300Light,
} from "@expo-google-fonts/barlow-condensed";
import AppLoading from "expo-app-loading";
import { ThemeProvider } from "styled-components/native";

import { NavigationContainer } from "@react-navigation/native";
import { LogBox, Text, View } from "react-native";
import theme from "./src/global/styles/theme";
import AppProvider from "./src/hooks";
import { Route } from "./src/routes";

export default function App() {
  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_900Black,
    Comfortaa_400Regular,
    Comfortaa_500Medium,
    BarlowCondensed_400Regular,
    BarlowCondensed_600SemiBold,
    BarlowCondensed_300Light,
  });

  if (!loaded) {
    return <AppLoading />;
  }
  LogBox.ignoreLogs([`Setting a timer for a long period`]);

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" hidden />
        <AppProvider>
          <View style={{ flex: 1 }}>
            <Route />
          </View>
        </AppProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
