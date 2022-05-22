import { Feather, FontAwesome, Zocial } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../global/styles/theme";
import {
  Avatar,
  Box,
  Container,
  MapView,
  Title,
  TitleMaps,
  TitleName,
  TitleSocial,
} from "./styles";

interface Props {
  name: string;
  workName: string;
  face: () => void;
  insta: () => void;
  whats: () => void;
  maps: () => void;
  avatar: string;
}

export function FindMembroComponent({
  name,
  workName,
  face,
  insta,
  whats,
  maps,
  avatar,
}: Props) {
  return (
    <Container>
      <View style={{ flexDirection: "row" }}>
        <Avatar source={{ uri: avatar }} />
        <View style={{ marginLeft: RFValue(10) }}>
          <TitleName>{name} </TitleName>
          <Title>{workName}</Title>
        </View>
      </View>

      <MapView onPress={maps}>
        <Feather
          name="map-pin"
          color={theme.colors.primary}
          size={RFValue(20)}
        />
        <TitleMaps>endereço</TitleMaps>
      </MapView>

      <Title>Midias sociais</Title>

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Box onPress={whats}>
          <FontAwesome name="whatsapp" color={theme.colors.primary} />
          <TitleSocial>Whatts</TitleSocial>
        </Box>

        <Box onPress={face}>
          <Zocial name="facebook" color={theme.colors.primary} />

          <TitleSocial>Face </TitleSocial>
        </Box>

        <Box onPress={insta}>
          <Zocial name="instagram" color={theme.colors.primary} />

          <TitleSocial>Insta</TitleSocial>
        </Box>
      </View>
    </Container>
  );
}
