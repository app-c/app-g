/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, View } from "react-native";

import { Modalize } from "react-native-modalize";
import { date } from "yup/lib/locale";
import { format } from "date-fns";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import fire from "@react-native-firebase/firestore";
import { TextArea } from "native-base";
import { HeaderContaponent } from "../../components/HeaderComponent";
import {
   BoxButton,
   BoxInput,
   BoxModal,
   BoxTextInput,
   Container,
   Input,
   TextButon,
   Title,
} from "./styles";

import { IUserDto } from "../../dtos";
import { MembrosComponents } from "../../components/MembrosCompornents";
import { useAuth } from "../../hooks/AuthContext";
import { Box } from "../FindMembro/styles";
import { InputCasdastro } from "../../components/InputsCadastro";
import theme from "../../global/styles/theme";

export function Indicacoes() {
   const { user, orderIndicacao, listUser } = useAuth();
   const refModal = useRef<Modalize>(null);
   const { navigate } = useNavigation();

   const [users, setUsers] = useState<IUserDto[]>([]);
   const [descricao, setDescricao] = useState("");
   const [userId, setUserId] = useState("");
   const [work, setWork] = useState("");
   const [nomeCliente, setNomeCliente] = useState("");
   const [telefoneCliente, setTelefoneCliente] = useState("");
   const [value, setValue] = useState("");
   const [lista, setLista] = useState<IUserDto[]>([]);

   useFocusEffect(
      useCallback(() => {
         setUsers(listUser);
      }, [listUser])
   );

   const OpenModal = useCallback((user_id: string, workName: string) => {
      setUserId(user_id);
      setWork(workName);
      refModal.current.open();
   }, []);

   const handleOrderIndicaĆ§ao = useCallback(() => {
      refModal.current.close();

      orderIndicacao({
         userId,
         quemIndicou: user.id,
         quemIndicouName: user.nome,
         quemIndicouWorkName: user.workName,
         nomeCliente,
         telefoneCliente,
         descricao,
      });

      Alert.alert("IndicaĆ§Ć£o", `Aguarde a validaĆ§Ć£o da ${work}`, [
         {
            text: "Ok",
            onPress: () => {
               navigate("Inicio");
            },
         },
      ]);
   }, [
      descricao,
      navigate,
      nomeCliente,
      orderIndicacao,
      telefoneCliente,
      user.id,
      user.nome,
      user.workName,
      userId,
      work,
   ]);

   useEffect(() => {
      if (value === "") {
         setLista(listUser);
      } else {
         setLista(
            listUser.filter((h) => {
               return h.nome.indexOf(value) > -1;
            })
         );
      }
   }, [listUser, users, value]);

   return (
      <Container>
         <HeaderContaponent title="Indicar um membro" type="tipo1" />

         <Form>
            <Box>
               <InputCasdastro
                  name="find"
                  icon="search"
                  type="custom"
                  options={{ mask: "****************************" }}
                  onChangeText={(text) => setValue(text)}
                  value={value}
               />
            </Box>
         </Form>

         <FlatList
            data={lista}
            keyExtractor={(h) => h.id}
            renderItem={({ item: h }) => (
               <MembrosComponents
                  imageOfice={h.logoUrl}
                  oficio={h.workName}
                  user_avatar={h.avatarUrl}
                  icon="indicar"
                  userName={h.nome}
                  pres={() => OpenModal(h.id, h.workName)}
                  inativoPres={h.inativo}
                  inativo={h.inativo}
               />
            )}
         />

         <Modalize ref={refModal} snapPoint={400} modalHeight={700}>
            <BoxModal>
               <View
                  style={{
                     flexDirection: "row",
                     justifyContent: "space-between",
                     padding: 10,
                  }}
               >
                  <Title>DescriĆ§ao</Title>
                  <Title>{descricao.length}/100</Title>
               </View>
               <TextArea
                  h="20%"
                  borderRadius={10}
                  maxLength={100}
                  value={descricao}
                  onChangeText={(h) => setDescricao(h)}
                  fontFamily={theme.fonts.regular}
                  fontSize={14}
               />

               <BoxInput>
                  <Input
                     placeholder="Nome do cliente"
                     onChangeText={setNomeCliente}
                     value={nomeCliente}
                  />
               </BoxInput>

               <BoxInput>
                  <Input
                     placeholder="telefone do cliente"
                     onChangeText={setTelefoneCliente}
                     value={telefoneCliente}
                  />
               </BoxInput>

               <BoxButton onPress={handleOrderIndicaĆ§ao}>
                  <TextButon>enviar</TextButon>
               </BoxButton>
            </BoxModal>
         </Modalize>
      </Container>
   );
}
