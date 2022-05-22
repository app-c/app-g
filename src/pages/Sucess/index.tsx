/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Image, Message, Title } from "./styles";
import logo from "../../assets/logo.png";

interface RouteParams {
  token: string;
  workName: string;
  nome: string;
  description: string;
}

export function Sucess() {
  const route = useRoute();
  const paramsRoute = route.params as RouteParams;

  const { navigate, reset } = useNavigation();

  const [token, setToken] = useState(paramsRoute.token);

  // const sendPushNotification = useCallback(async () => {
  //   const message = {
  //     to: token,
  //     sound: "default",
  //     title: "Alguem esta consumindo seu produto",
  //     body: `cliente ${paramsRoute.nome} está adiquirindo: ${paramsRoute.description}`,
  //   };

  //   await fetch("https://exp.host/--/api/v2/push/send", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Accept-encoding": "gzip, deflate",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(message),
  //   });
  // }, []);

  const navigateToHome = useCallback(() => {
    reset({
      routes: [{ name: "INÍCIO" }],
    });
  }, [reset]);

  return (
    <Container>
      <Message style={{ textAlign: "center", fontSize: 28 }}>
        OPERAÇAO REALIZADA!!
      </Message>

      <Message style={{ textAlign: "center" }}>
        Aguarde a confimação da {paramsRoute.workName}
      </Message>

      <Button onPress={navigateToHome}>
        <Title>Ok</Title>
      </Button>
      <Image source={logo} />
    </Container>
  );
}
