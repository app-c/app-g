/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import { Modalize } from "react-native-modalize";
import { format } from "date-fns";
import fire from "@react-native-firebase/firestore";
import { acc } from "react-native-reanimated";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import {
  Avatar,
  Box,
  BoxIco,
  BoxPrice,
  ComprasText,
  Container,
  FontAwes,
  IconAnt,
  IconFont,
  IconFoundation,
  IconIoncic,
  IConSimple,
  Line,
  Scroll,
  Title,
  TitleName,
  TitleP,
  TitlePrice,
} from "./styles";
// import { registerForPushNotificationsAsync } from "../../components/Notification/Notification";
import handImage from "../../assets/hand.png";
import { ModalOrderIndication } from "../../components/ModalOrderIndication";
import { IUserDto } from "../../dtos";
import { ModalB2b } from "../../components/ModalB2b";
import { MessageComponent } from "../../components/MessageComponent";
import { colecao } from "../../collection";
import { Classificaçao } from "../Classificaçao";

interface IOrder_Indication {
  id: string;
  createdAt: string;
  descricao: string;
  quemIndicou: string;
  userId: string;
  quemIndicouName: string;
  quemIndicouWorkName: string;
  nomeCliente: string;
  telefoneCliente: string;
}

interface Propssuce {
  id: string;
  data: string;
  nome: string;
  quemIndicou: string;
}

interface PropsB2b {
  id: string;
  data: { nanoseconds: number; seconds: number };
  description: string;
  nome: string;
  user_id: string;
  prestador_id: string;
}

interface ProsTransaction {
  id: string;
  data: {};
  nome: string;
  prestador_id: string;
  valor: string;
  description: string;
  consumidor: string;
}

interface PriceProps {
  price: string;
  pts: number;
}

export function Inicio() {
  const { user, signOut, transactionAdd } = useAuth();
  const navigate = useNavigation();

  const modalRef = useRef<Modalize>(null);
  const modalSucess = useRef<Modalize>(null);
  const modalB2b = useRef<Modalize>(null);
  const modalTransaction = useRef<Modalize>(null);
  const [totalCompras, setTotalCompras] = useState(0);
  const [ptB2b, setPtB2b] = useState(0);
  const [ptInd, setPtInd] = useState(0);
  const [ptPrs, setPtPrs] = useState(0);
  const [ptPad, setPtPad] = useState(0);
  const [ptVen, setPtVen] = useState(0);
  const [ptCom, setPtCom] = useState(0);

  const [sucess, setSucess] = useState<Propssuce[]>([]);
  const [price, setPrice] = useState<PriceProps>({});
  const [montante, setMontante] = useState("");
  const [montanteP, setMontanteP] = useState("");
  const [orderB2b, setOrderB2b] = useState<PropsB2b[]>([]);
  const [orderTransaction, setOrderTransaction] = useState<ProsTransaction[]>(
    []
  );
  const [orderIndication, setOrderIndication] = useState<IOrder_Indication[]>(
    []
  );

  useEffect(() => {
    const load = fire()
      .collection(colecao.orderIndication)
      .onSnapshot((h) => {
        const order = h.docs.map((p) => {
          return {
            id: p.id,
            ...p.data(),
          } as IOrder_Indication;
        });

        setOrderIndication(order.filter((h) => h.userId === user.id));
      });

    return () => load();
  }, [user.id]);

  useEffect(() => {
    const load = fire()
      .collection("sucess_indication")
      .onSnapshot((suce) => {
        const res = suce.docs.map((p) => {
          return {
            id: p.id,
            ...p.data(),
          } as Propssuce;
        });
        const fil = res.filter((h) => h.quemIndicou === user.id);
        setSucess(fil);
      });

    return () => load();
  }, [user.id]);

  useEffect(() => {
    const load = fire()
      .collection(colecao.orderB2b)
      .onSnapshot((h) => {
        const res = h.docs.map((p) => {
          return {
            id: p.id,
            ...p.data(),
          } as PropsB2b;
        });
        setOrderB2b(res.filter((h) => h.prestador_id === user.id));
      });

    return () => load();
  }, [user.id]);

  useEffect(() => {
    const load = fire()
      .collection(colecao.orderTransaction)
      .onSnapshot((h) => {
        const res = h.docs
          .map((p) => {
            return {
              id: p.id,
              ...p.data(),
            } as ProsTransaction;
          })
          .filter((h) => h.prestador_id === user.id);

        setOrderTransaction(res);
      });
    return () => load();
  }, [user.id]);

  const ClosedModal = useCallback(() => {
    modalRef.current.close();
    modalTransaction.current.close();
  }, []);

  const ClosedModalSucess = useCallback(() => {
    modalSucess.current.close();
  }, []);

  const HandShak = useCallback(
    (quemIndicou: string, id: string) => {
      navigate.navigate("indication", { quemIndicou, id });
    },
    [navigate]
  );

  const HandFailIndication = useCallback(
    async (id: string, quemIndicou: string) => {
      fire().collection(colecao.orderIndication).doc(id).delete();

      fire()
        .collection("sucess_indication")
        .add({
          createdAt: format(new Date(Date.now()), "dd/MM - HH:mm"),
          nome: user.nome,
          quemIndicou,
        });

      fire()
        .collection(colecao.users)
        .doc(quemIndicou)
        .get()
        .then((h) => {
          let { indicacao } = h.data() as IUserDto;
          fire()
            .collection(colecao.users)
            .doc(quemIndicou)
            .update({
              indicacao: (indicacao += 1),
            });
        })
        .catch(() =>
          Alert.alert("Algo deu errado", "dados do usuário nao recuperado")
        );
    },
    [user.nome]
  );

  const handleFailB2b = useCallback((id: string) => {
    fire().collection(colecao.orderB2b).doc(id).delete();
    modalB2b.current.close();
  }, []);

  const handleSucessB2b = useCallback(
    (id: string, user_id: string, prestador_id: string) => {
      const data = format(new Date(Date.now()), "dd-MM-yy-HH-mm");
      fire()
        .collection("b2b")
        .add({
          id,
          user_id,
          prestador_id,
          data,
        })
        .then(() => {
          fire().collection(colecao.orderB2b).doc(id).delete();
          Alert.alert("B2B realizado com sucesso!");
          modalB2b.current.close();
        });
    },
    []
  );

  const handleSucess = useCallback(async (id: string) => {
    fire().collection("sucess_indication").doc(id).delete();
  }, []);

  // todo TRANSAÇÃO.......................................................................

  const handleTransaction = useCallback(
    async (
      prestador_id: string,
      consumidor: string,
      descricao: string,
      id: string,
      valor: string
    ) => {
      fire()
        .collection(colecao.transaction)
        .add({
          prestador_id,
          descricao,
          type: "entrada",
          createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
          valor,
        });

      fire()
        .collection(colecao.transaction)
        .add({
          consumidor,
          descricao,
          type: "saida",
          createdAt: format(new Date(Date.now()), "dd-MM-yyy-HH-mm"),
          valor,
        });

      fire()
        .collection("order_transaction")
        .doc(id)
        .delete()
        .then(() => Alert.alert("Transação confirmada"))
        .catch((err) => console.log(err));
    },
    []
  );

  const DeleteTransaction = useCallback(async (id: string) => {
    const ref = fire()
      .collection(colecao.transaction)
      .doc(id)
      .delete()
      .then(() => Alert.alert("Transação deletada"));
  }, []);
  // todo .......................................................................

  //* *....................................................................... */
  const load = useCallback(() => {
    fire()
      .collection("transaction")
      .onSnapshot((h) => {
        const rs = h.docs
          .map((p) => p.data())
          .filter((l) => l.prestador_id === user.id);

        const somoa = rs.reduce((ac, it) => {
          return ac + it.valor;
        }, 0);
        setTotalCompras(somoa);
      });

    fire()
      .collection("b2b")
      .onSnapshot((b2b) => {
        const res = b2b.docs
          .map((h) => h.data())
          .filter((h) => h.user_id === user.id);
        setPtB2b(res.length * 20);
      });

    fire()
      .collection(colecao.presenca)
      .onSnapshot((b2b) => {
        const res = b2b.docs
          .map((h) => h.data())
          .filter((h) => h.user_id === user.id && h.presenca === true);
        setPtPrs(res.length * 10);
      });

    fire()
      .collection(colecao.users)
      .onSnapshot((b2b) => {
        const res = b2b.docs
          .map((h) => h.data())
          .filter((h) => h.id === user.id)
          .reduce((ac, it) => {
            return ac + it.indicacao;
          }, 0);
        setPtInd(res * 15);
      });

    fire()
      .collection(colecao.users)
      .onSnapshot((b2b) => {
        const res = b2b.docs
          .map((h) => h.data())
          .filter((h) => h.id === user.id)
          .reduce((ac, it) => {
            return ac + it.padrinhQuantity;
          }, 0);
        setPtPad(res * 35);
      });

    fire()
      .collection(colecao.transaction)
      .onSnapshot((b2b) => {
        const res = b2b.docs.map((h) => h.data());

        const filCompras = res.filter((h) => h.prestador_id === user.id);
        const filVendas = res.filter((h) => h.consumidor === user.id);

        setPtCom(filCompras.length * 10);
        setPtVen(filVendas.length * 10);
      });
  }, [user.id]);
  //* *....................................................................... */

  useEffect(() => {
    const load = fire()
      .collection(colecao.transaction)
      .onSnapshot((h) => {
        const res = h.docs.map((p) => p.data());
        const data = res.filter((h) => {
          if (h.prestador_id === user.id && h.type === "entrada") {
            return h;
          }
        });

        const MontatePass = res
          .filter((h) => {
            const data = h.createdAt ? h.createdAt : "00-00-00-00-00";
            const [dia, mes, ano, hora, min] = data.split("-").map(Number);
            const DateN = new Date(Date.now()).getFullYear() - 1;
            if (h.type === "entrada" && ano === DateN) {
              return h;
            }
          })
          .reduce((acc, item) => {
            return acc + Number(item.valor);
          }, 0);

        const MontateAtual = res
          .filter((h) => {
            const data = h.createdAt ? h.createdAt : "00-00-00-00-00";

            const [dia, mes, ano, hora, min] = data.split("-").map(Number);
            const DateN = new Date(Date.now()).getFullYear();
            if (h.type === "entrada" && ano === DateN) {
              return h;
            }
          })
          .reduce((acc, item) => {
            return acc + Number(item.valor);
          }, 0);

        const mp = 3242222780 / 1000 + MontateAtual;

        setMontanteP(
          MontatePass.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
        );

        setMontante(
          mp.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
        );

        const total = data.reduce((acc, item) => {
          return acc + Number(item.valor);
        }, 0);

        const price = total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const pts = data.length * 10;

        const pricePts = {
          price,
          pts,
        };

        setPrice(pricePts);
      });

    return () => load();
  }, [user.id]);

  const anoPass = new Date(Date.now()).getFullYear() - 1;
  const anoAtual = new Date(Date.now()).getFullYear();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    const myString = "23,43.22.34";
    const splits = myString.split(/(\d)/);

    console.log(splits.filter((h) => h === "."));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (orderIndication.length > 0) {
        modalRef.current.open();
      }
      if (sucess.length > 0) {
        modalSucess.current.open();
      }
      if (orderB2b.length > 0) {
        modalB2b.current.open();
      }

      if (orderTransaction.length > 0) {
        modalTransaction.current.open();
      }
    }, [
      orderB2b.length,
      orderIndication.length,
      orderTransaction.length,
      sucess.length,
    ])
  );

  return (
    <Container>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigate.dispatch(DrawerActions.openDrawer())}
        >
          <MaterialCommunityIcons
            name="menu"
            size={40}
            color={theme.colors.focus}
          />
        </TouchableOpacity>
      </View>

      {user.avatarUrl ? (
        <Avatar source={{ uri: user.avatarUrl }} />
      ) : (
        <BoxIco>
          <Feather name="user" size={100} />
        </BoxIco>
      )}

      <TitleName> {user.nome} </TitleName>

      <View style={{ alignItems: "center" }}>
        <ComprasText>Vendas</ComprasText>

        <BoxPrice>
          <TitlePrice>{price.price}</TitlePrice>
          <TitleP>{ptB2b + ptCom + ptInd + ptPad + ptVen + ptPrs} pts</TitleP>
        </BoxPrice>
      </View>

      <View style={{ alignSelf: "center" }}>
        <Text style={{ marginLeft: 16 }}>Vendas do G.E.B {montante}</Text>
      </View>

      <Modalize
        ref={modalSucess}
        snapPoint={300}
        modalHeight={450}
        modalStyle={{
          width: "90%",
          alignSelf: "center",
        }}
      >
        <View>
          <TouchableOpacity
            onPress={ClosedModalSucess}
            style={{
              alignSelf: "flex-end",
              marginRight: 10,
              Vending: 10,
            }}
          >
            <AntDesign
              name="closecircle"
              size={30}
              color={theme.colors.focus}
            />
          </TouchableOpacity>

          {sucess.map((h) => (
            <View key={h.id} style={{ padding: 20 }}>
              <Text>
                Sucesso! {h.nome} esta negociando com o cliente que voce indicou
              </Text>

              <TouchableOpacity
                onPress={() => {
                  handleSucess(h.id);
                }}
                style={{
                  width: 80,
                  height: 30,
                  alignSelf: "center",
                  alignItems: "center",
                  backgroundColor: theme.colors.focus,
                  justifyContent: "center",
                  borderRadius: 7,
                }}
              >
                <Text style={{ color: theme.colors.primary }}>OK</Text>
              </TouchableOpacity>

              <Line />
            </View>
          ))}
        </View>
      </Modalize>

      <Modalize
        handlePosition="inside"
        ref={modalRef}
        snapPoint={400}
        modalStyle={{
          width: "90%",
          alignSelf: "center",
        }}
      >
        <View>
          <TouchableOpacity
            onPress={ClosedModal}
            style={{
              alignSelf: "flex-end",
              marginRight: 10,
              padding: 10,
            }}
          >
            <AntDesign
              name="closecircle"
              size={30}
              color={theme.colors.focus}
            />
          </TouchableOpacity>
          {orderIndication.map((h) => (
            <View key={h.id}>
              <ModalOrderIndication
                description={h.descricao}
                clientName={h.nomeCliente}
                telefone={h.telefoneCliente}
                handShak={() => {
                  HandShak(h.quemIndicou, h.id);
                }}
                failTransaction={() => HandFailIndication(h.id, h.quemIndicou)}
                quemIndicouName={h.quemIndicouName}
                quemIndicouWorkName={h.quemIndicouWorkName}
              />
            </View>
          ))}
        </View>
      </Modalize>

      <Modalize
        handlePosition="inside"
        ref={modalB2b}
        snapPoint={400}
        modalStyle={{
          width: "90%",
          alignSelf: "center",
        }}
      >
        <View>
          <TouchableOpacity
            onPress={ClosedModal}
            style={{
              alignSelf: "flex-end",
              marginRight: 10,
              padding: 10,
            }}
          >
            <AntDesign
              name="closecircle"
              size={30}
              color={theme.colors.focus}
            />
          </TouchableOpacity>
          {orderB2b.map((h) => (
            <View key={h.data.nanoseconds}>
              <ModalB2b
                clientName={h.nome}
                handShak={() => {
                  handleSucessB2b(h.id, h.user_id, h.prestador_id);
                }}
                failTransaction={() => handleFailB2b(h.id)}
              />
            </View>
          ))}
        </View>
      </Modalize>

      <Modalize
        handlePosition="inside"
        ref={modalTransaction}
        snapPoint={300}
        modalStyle={{
          width: "90%",
          alignSelf: "center",
        }}
      >
        <View>
          <TouchableOpacity
            onPress={ClosedModal}
            style={{
              alignSelf: "flex-end",
              marginRight: 10,
              padding: 10,
            }}
          >
            <AntDesign
              name="closecircle"
              size={30}
              color={theme.colors.focus}
            />
          </TouchableOpacity>
          {orderTransaction.map((h) => (
            <View key={h.id}>
              <MessageComponent
                confirmar={() => {
                  handleTransaction(
                    h.prestador_id,
                    h.consumidor,
                    h.description,
                    h.id,
                    h.valor
                  );
                }}
                nome={h.nome}
                rejeitar={() => {
                  DeleteTransaction(h.id);
                }}
                valor={h.valor}
              />
            </View>
          ))}
        </View>
      </Modalize>

      <Line />

      <Classificaçao />
    </Container>
  );
}
