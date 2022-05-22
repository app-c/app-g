/* eslint-disable array-callback-return */
import React, { useCallback } from "react";
import { FlatList } from "react-native";
import fire from "@react-native-firebase/firestore";
import { HeaderContaponent } from "../../../components/HeaderComponent";
import { MembrosComponents } from "../../../components/MembrosCompornents";
import { Container, Title, Touch } from "./styles";
import { colecao } from "../../../collection";
import { useAuth } from "../../../hooks/AuthContext";

export function Inativo() {
  const { listUser } = useAuth();

  const handleInativar = useCallback((id: string, inativo: boolean) => {
    fire().collection(colecao.users).doc(id).update({
      inativo: !inativo,
    });
  }, []);

  return (
    <Container>
      <HeaderContaponent
        title="Inativar um membro"
        type="tipo1"
        onMessage="of"
      />

      <FlatList
        data={listUser}
        keyExtractor={h => h.id}
        renderItem={({ item: h }) => (
          <MembrosComponents
            userName={h.nome}
            user_avatar={h.avatarUrl}
            oficio={h.workName}
            imageOfice={h.logoUrl}
            pres={() => {
              handleInativar(h.id, h.inativo);
            }}
            inativo={h.inativo}
          />
        )}
      />
    </Container>
  );
}
