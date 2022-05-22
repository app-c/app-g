/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef, useState } from "react";

import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import { Alert, Text, View } from "react-native";
import { BoxInput, BoxLogo, Container, Logo, Title } from "./styles";
import { Input } from "../../components/Inputs";
import { Button } from "../../components/Button";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/AuthContext";
import theme from "../../global/styles/theme";

interface FormData {
  membro: string;
  senha: string;
}

export function SingIn() {
  const { signIn } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      if (!data.membro || !data.senha) {
        return Alert.alert("Login", "forneça um email e uma senha");
      }

      await signIn({
        email: data.membro,
        senha: data.senha,
      });
    },
    [signIn]
  );

  return (
    <Container behavior="padding">
      <Text
        style={{
          alignSelf: "flex-end",
          color: theme.colors.primary_light,
          fontSize: 12,
          marginRight: 20,
          top: 30,
        }}
      >
        version: 2.1.0
      </Text>
      <BoxLogo>
        <Logo source={logo} />
      </BoxLogo>

      <BoxInput>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <View>
            <Title>E-mail</Title>
            <Input
              type="custom"
              options={{
                mask: "***************************",
              }}
              autoCapitalize="none"
              name="membro"
              icon="user"
            />
          </View>

          <View>
            <Title>Senha</Title>
            <Input
              type="custom"
              options={{
                mask: "*************************",
              }}
              name="senha"
              icon="lock"
            />
          </View>
          <Button pres={() => formRef.current?.submitForm()} title="ENTRAR" />
        </Form>
      </BoxInput>
    </Container>
  );
}
