import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Ranking } from "../pages/ADM/Classificaçao";
import { SingUp } from "../pages/ADM/CreateUser";
import { Classificaçao } from "../pages/Classificaçao";
import { Consumo } from "../pages/Consumo";
import { FindUser } from "../pages/FindMembro";
import { Valide } from "../pages/ValidePresença";
import { Inicio } from "../pages/Inicio";
import { Profile } from "../pages/Profile";
import { ListPresenca } from "../pages/ADM/ListaPresenca";
import { UpdateSenhaUser } from "../pages/ADM/UpdateSenhaUser";
import { DeletUser } from "../pages/ADM/DeleteUser";
import { Inativo } from "../pages/ADM/Inativo";
import { Indicaçoes } from "../pages/Indicaçes";
import { Indication } from "../pages/Idication";
import { TabBarApp } from "./TabBarApp";
import { StacKMembros } from "./StackMembros";
import { B2B } from "../pages/B2B";
import { StackB2b } from "./StackB2b";

const Stak = createNativeStackNavigator();

export function AuthApp() {
  return (
    <Stak.Navigator
      initialRouteName="Inicio"
      screenOptions={{ headerShown: false }}
    >
      <Stak.Screen name="Inicio" component={Inicio} />
      <Stak.Screen name="valide" component={Valide} />
      <Stak.Screen name="perfil" component={Profile} />
      <Stak.Screen name="home" component={TabBarApp} />
      <Stak.Screen name="consumo" component={Consumo} />
      <Stak.Screen name="negociar" component={StacKMembros} />
      <Stak.Screen name="indicacao" component={Indicaçoes} />
      <Stak.Screen name="b2b" component={StackB2b} />

      <Stak.Screen name="ranking" component={Ranking} />
      <Stak.Screen name="user" component={SingUp} />
      <Stak.Screen name="updateSenha" component={UpdateSenhaUser} />
      <Stak.Screen name="delete" component={DeletUser} />
      {/* <Stak.Screen name="push" component={Push} /> */}
      <Stak.Screen name="classificaçao" component={Classificaçao} />
      <Stak.Screen name="findUser" component={FindUser} />
      <Stak.Screen name="presenca" component={ListPresenca} />
      <Stak.Screen name="indication" component={Indication} />
      <Stak.Screen name="inativo" component={Inativo} />
    </Stak.Navigator>
  );
}
