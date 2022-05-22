import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Linking, View } from "react-native";
import { Form } from "@unform/mobile";
import * as Linkin from "expo-linking";
import fire from "@react-native-firebase/firestore";
import { FindMembroComponent } from "../../components/FindMembro";
import { IUserDto } from "../../dtos";
import { Box, Container, Flat, Title } from "./styles";
import { HeaderContaponent } from "../../components/HeaderComponent";
import { InputCasdastro } from "../../components/InputsCadastro";
import { colecao } from "../../collection";
import { Loading } from "../../components/Loading";
import { useAuth } from "../../hooks/AuthContext";

export function FindUser() {
  const { user } = useAuth();
  const [membro, setMembro] = useState<IUserDto[]>([]);
  const [value, setValue] = useState("");
  const [lista, setLista] = useState<IUserDto[]>([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const load = fire()
      .collection(colecao.users)
      .onSnapshot((h) => {
        const re = h.docs
          .map((p) => {
            return p.data() as IUserDto;
          })
          .filter((f) => f.inativo === false)
          .sort((a, b) => {
            if (a.nome < b.nome) {
              return -1;
            }
          })
          .map((h) => {
            const wa = `https://wa.me/55${h.whats.slice(1, 3)}${h.whats.slice(
              5,
              -5
            )}${h.whats.slice(-4)}`;
            return {
              ...h,
              wa,
            };
          });
        setMembro(re);
        setLoad(false);
      });
    return () => load();
  }, []);

  const handlePress = useCallback(async (url: string) => {
    await Linkin.openURL(url);
  }, []);

  useEffect(() => {
    if (value === "") {
      setLista(membro);
    } else {
      setLista(
        membro
          .filter((h) => {
            return h.nome.indexOf(value) > -1;
          })
          .sort()
      );
    }
  }, [membro, value]);

  return (
    <>
      {load ? (
        <Loading />
      ) : (
        <Container>
          <HeaderContaponent
            title="Localizar membros"
            type="tipo1"
            onMessage="of"
          />

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
            // contentContainerStyle={{ paddingBottom: 150 }}
            data={lista}
            keyExtractor={(h) => h.id}
            renderItem={({ item: h }) => (
              <View>
                <FindMembroComponent
                  avatar={h.avatarUrl}
                  name={h.nome}
                  workName={h.workName}
                  whats={() => handlePress(h.links[0])}
                  face={() => handlePress(h.links[1])}
                  insta={() => handlePress(h.links[2])}
                  maps={() => handlePress(h.wa)}
                />
              </View>
            )}
          />
        </Container>
      )}
    </>
  );
}
