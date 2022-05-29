/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef, useState } from "react";

import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import { Alert, Text, View } from "react-native";
import { FormControl, WarningOutlineIcon, Input } from "native-base";
import { BoxInput, BoxLogo, Container, Logo, Title } from "./styles";
// import { Input } from "../../components/Inputs";
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

   const [email, setEmail] = useState("");
   const [pass, setPass] = useState("");
   const [errEmail, setErrEmail] = useState(false);
   const [errPass, setErrPass] = useState(false);

   const handleSubmit = useCallback(async () => {
      if (email === "" || pass === "") {
         return Alert.alert("Login", "forneça um email e uma senha");
      }

      setErrEmail(false);
      setErrPass(false);

      await signIn({
         email,
         senha: pass,
      }).catch((err) => {
         const { code } = err;
         if (code === "auth/user-not-found") {
            setErrEmail(true);
            return Alert.alert("Login", "usuário nao encontrado");
         }

         if (code === "auth/invalid-email") {
            setErrEmail(true);
            return Alert.alert("Login", "email incorreto");
         }

         if (code === "auth/wrong-password") {
            setErrPass(true);
            return Alert.alert("Login", "senha incorreto");
         }
         return Alert.alert("Login", "usuário nao encontrado");
      });
   }, [email, pass, signIn]);

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
            version: 2.1.3
         </Text>
         <BoxLogo>
            <Logo source={logo} />
         </BoxLogo>

         <BoxInput>
            <Form ref={formRef} onSubmit={handleSubmit}>
               <FormControl isInvalid={errEmail} w="75%" maxW="300px">
                  <FormControl.Label>E-MAIL</FormControl.Label>
                  <Input
                     w="100%"
                     color={theme.colors.text_secundary}
                     type="text"
                     autoCapitalize="none"
                     keyboardType="email-address"
                     onChangeText={(h) => setEmail(h)}
                     value={email}
                     selectionColor={theme.colors.text_secundary}
                  />
                  <FormControl.ErrorMessage
                     leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                     Verefique seu email e tente novamente
                  </FormControl.ErrorMessage>
               </FormControl>

               <FormControl mt={8} isInvalid={errPass} w="75%" maxW="300px">
                  <FormControl.Label>SENHA</FormControl.Label>
                  <Input
                     w="100%"
                     color={theme.colors.text_secundary}
                     onChangeText={(h) => setPass(h)}
                     value={pass}
                     selectionColor={theme.colors.text_secundary}
                  />
                  <FormControl.ErrorMessage
                     leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                     Try different from previous passwords.
                  </FormControl.ErrorMessage>
               </FormControl>
               {/* <View>
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
               */}
               <View style={{ marginTop: 32 }}>
                  <Button
                     pres={() => formRef.current?.submitForm()}
                     title="ENTRAR"
                  />
               </View>
            </Form>
         </BoxInput>
      </Container>
   );
}
