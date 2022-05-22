import { Feather, FontAwesome } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { DrawerContent } from "../components/DrawerComponent";
import theme from "../global/styles/theme";
import { useAuth } from "../hooks/AuthContext";
import { StackIndication } from "./StackInicio";
import { Valide } from "../pages/ValidePresença";
import { Profile } from "../pages/Profile";
import { Consumo } from "../pages/Consumo";
import { Indicaçoes } from "../pages/Indicaçes";
import { FindUser } from "../pages/FindMembro";
import { Inativo } from "../pages/ADM/Inativo";
import { Ranking } from "../pages/ADM/Classificaçao";
import { SingUp } from "../pages/ADM/CreateUser";
import { ListPresenca } from "../pages/ADM/ListaPresenca";
import { UpdateSenhaUser } from "../pages/ADM/UpdateSenhaUser";
import { DeletUser } from "../pages/ADM/DeleteUser";
import { TabBarApp } from "./TabBarApp";
import { StacKMembros } from "./StackMembros";
import { StackB2b } from "./StackB2b";

const { Navigator, Screen } = createDrawerNavigator();

const rotas = [
  {
    focus: theme.colors.focus_second,
    color: theme.colors.focus_second_3,
    name: "POSTS",
    component: TabBarApp,
    icon: "camera-retro",
  },
  {
    focus: theme.colors.focus_second,
    color: theme.colors.focus_second_3,
    name: "PERFIL",
    component: Profile,
    icon: "user-circle-o",
  },
  {
    focus: theme.colors.focus_second,
    color: theme.colors.focus_second_3,
    name: "LOCALIZE OS MEMBROS",
    component: FindUser,
    icon: "map-marker",
  },
  {
    focus: theme.colors.focus_second,
    color: theme.colors.focus_second_3,
    name: "EXTRATO",
    component: Consumo,
    icon: "line-chart",
  },
  {
    focus: theme.colors.focus,
    color: theme.colors.focus_light_3,
    name: "VALIDE SUA PRESENÇA",
    component: Valide,
    icon: "hand-peace-o",
  },
  {
    focus: theme.colors.focus,
    color: theme.colors.focus_light_3,
    name: "NEGOCIAR",
    component: StacKMembros,
    icon: "handshake-o",
  },
  {
    focus: theme.colors.focus,
    color: theme.colors.focus_light_3,
    name: "INDICAÇÕES",
    component: Indicaçoes,
    icon: "exchange",
  },
  {
    focus: theme.colors.focus,
    color: theme.colors.focus_light_3,
    name: "B2B",
    component: StackB2b,
    icon: "users",
  },
];

const rotasAdm = [
  {
    color: theme.colors.secundary,
    name: "RANKING",
    component: Ranking,
    icon: "",
  },
  {
    color: theme.colors.secundary,
    name: "CADASTRAR MEMBRO",
    component: SingUp,
    icon: "",
  },
  {
    color: theme.colors.secundary,
    name: "CONFIRMAR PRESENÇA DOS MEMBROS",
    component: ListPresenca,
    icon: "",
  },
  {
    color: theme.colors.secundary,
    name: "ALTERAR SENHA DE UM MEMBRO",
    component: UpdateSenhaUser,
    icon: "",
  },
  {
    color: theme.colors.secundary,
    name: "EXCLUIR UM MEMBRO",
    component: DeletUser,
    icon: "",
  },
  {
    color: theme.colors.secundary,
    name: "INATIVAR UM MEMBRO",
    component: Inativo,
    icon: "",
  },
];

export function DrawerApp() {
  const { user } = useAuth();
  return (
    <Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        options={{
          drawerIcon: ({ focused, size }) => (
            <FontAwesome
              name="home"
              size={size}
              color={
                focused
                  ? theme.colors.focus_second
                  : theme.colors.focus_second_3
              }
            />
          ),
        }}
        name="INÍCIO"
        component={StackIndication}
      />
      {rotas.map((h) => (
        <Screen
          key={h.name}
          options={{
            drawerIcon: ({ focused, size }) => (
              <FontAwesome
                name={h.icon}
                size={size}
                color={focused ? h.focus : h.color}
              />
            ),
          }}
          name={h.name}
          component={h.component}
        />
      ))}

      {user.adm &&
        rotasAdm.map((h) => (
          <Screen
            key={h.name}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Feather name={h.icon} size={size} color="red" />
              ),
            }}
            name={h.name}
            component={h.component}
          />
        ))}
    </Navigator>
  );
}
