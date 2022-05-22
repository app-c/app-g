/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from "react";

import {
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import Firestore from "@react-native-firebase/firestore";
import { useAuth } from "../../hooks/AuthContext";
import {
  Avatar,
  Container,
  Header,
  LogOf,
  TextContainer,
  Title,
  TitleName,
} from "./styles";
import theme from "../../global/styles/theme";

type Props = DrawerContentComponentProps;

export function DrawerContent({ ...props }: Props) {
  const { signOut, user, updateUser } = useAuth();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <Header>
        <TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.focus_second} />
          ) : (
            <Avatar source={{ uri: user.avatarUrl }} />
          )}
        </TouchableOpacity>
        <TextContainer>
          <Text style={{ color: theme.colors.text, fontSize: RFValue(18) }}>
            Olá
          </Text>
          <TitleName>{user.nome} </TitleName>
        </TextContainer>
      </Header>

      <ScrollView>
        <DrawerItemList {...props} />

        <LogOf
          onPress={() => {
            signOut();
          }}
        >
          <Title style={{ color: theme.colors.tex_light }}>SAIR</Title>
        </LogOf>
      </ScrollView>
    </Container>
  );
}
