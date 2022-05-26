/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useState,
} from "react";
import { Alert } from "react-native";
import Auth from "@react-native-firebase/auth";
import Firestore from "@react-native-firebase/firestore";

import { format } from "date-fns";
import { boolean } from "yup";
import {
   IOrderB2b,
   IOrderIndication,
   IOrderTransaction,
   ITransaction,
   IUserDto,
} from "../dtos";
import { colecao } from "../collection";

export interface User {
   id: string;
   nome: string;
   adm: boolean;
   padrinhQuantity: number;
}

interface SignInCred {
   email: string;
   senha: string;
}

interface AuthContexData {
   user: IUserDto | null;
   errPass: boolean;
   errEmail: boolean;
   erroEmail: boolean;
   loading: boolean;
   signIn(credential: SignInCred): Promise<void>;
   transactionAdd: (valor: ITransaction) => void;

   orderB2b: (valor: IOrderB2b) => void;
   orderIndicacao: (valor: IOrderIndication) => void;
   orderTransaction: (valor: IOrderTransaction) => void;
   signOut(): void;
   updateUser(user: IUserDto): Promise<void>;
   listUser: IUserDto[] | null;
}

const User_Collection = "@Geb:user";

export const AuthContext = createContext<AuthContexData>({} as AuthContexData);

export const AuthProvider: React.FC = ({ children }) => {
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<IUserDto | null>(null);

   const [listUser, setListUser] = useState<IUserDto[]>([]);

   const LoadingUser = useCallback(async () => {
      setLoading(true);

      const storeUser = await AsyncStorage.getItem(User_Collection);

      if (storeUser) {
         const userData = JSON.parse(storeUser) as IUserDto;
         setUser(userData);
      }

      setLoading(false);
   }, []);

   useEffect(() => {
      LoadingUser();
   }, [LoadingUser]);

   const signIn = useCallback(async ({ email, senha }) => {
      await Auth()
         .signInWithEmailAndPassword(email, senha)
         .then((au) => {
            Firestore()
               .collection(colecao.users)
               .doc(au.user.uid)
               .get()
               .then(async (profile) => {
                  console.log(profile);

                  const {
                     nome,
                     adm,
                     padrinhQuantity,
                     whats,
                     workName,
                     CNPJ,
                     ramo,
                     enquadramento,
                     links,
                     CPF,
                     avatarUrl,
                     logoUrl,
                     indicacao,
                     presenca,
                     inativo,
                  } = profile.data() as IUserDto;

                  if (profile.exists) {
                     const userData = {
                        email: au.user.email,
                        id: au.user.uid,
                        nome,
                        adm,
                        whats,
                        workName,
                        CNPJ,
                        CPF,
                        ramo,
                        enquadramento,
                        links,
                        padrinhQuantity,
                        avatarUrl,
                        logoUrl,
                        indicacao,
                        presenca,
                        inativo,
                     };
                     await AsyncStorage.setItem(
                        User_Collection,
                        JSON.stringify(userData)
                     );
                     setUser(userData);
                  }
               })
               .catch((err) => {
                  const { code } = err;
                  Alert.alert(
                     "Login",
                     "Não foi possível carregar os dados do usuário"
                  );
               });
         });
   }, []);

   //* ORDERS.................................................................

   const orderB2b = useCallback(
      async ({ prestador_id, user_id, description, nome }) => {
         if (!description) {
            Alert.alert("Transação", "informe uma descrição ");
            return;
         }

         Firestore()
            .collection(colecao.orderB2b)
            .add({
               prestador_id,
               user_id,
               description,
               nome,
               data: new Date(Date.now()),
            })
            .catch((err) => console.log(err));
      },
      []
   );

   const orderTransaction = useCallback(
      async ({ prestador_id, consumidor, valor, description, nome, data }) => {
         Firestore().collection(colecao.orderTransaction).add({
            prestador_id,
            consumidor /** user_id */,
            valor,
            description,
            nome /** user.nome */,
            data,
         });
      },
      []
   );

   const orderIndicacao = useCallback(
      ({
         userId,
         quemIndicou,
         quemIndicouName,
         quemIndicouWorkName,
         nomeCliente,
         telefoneCliente,
         descricao,
      }) => {
         Firestore()
            .collection(colecao.orderIndication)
            .add({
               userId,
               quemIndicou /** user_id */,
               quemIndicouName,
               quemIndicouWorkName,
               nomeCliente,
               telefoneCliente,
               descricao,
               createdAt: format(new Date(Date.now()), "dd-MM-yy-HH-mm"),
            });
      },
      []
   );

   //* .......................................................................

   const transactionAdd = useCallback(
      ({ prestador_id, descricao, type, valor, createdAt }) => {
         Firestore()
            .collection(colecao.transaction)
            .add({ prestador_id, descricao, type, valor, createdAt });
      },
      []
   );

   useEffect(() => {
      if (!user) {
         return;
      }
      const ld = Firestore()
         .collection(colecao.users)
         .onSnapshot((h) => {
            const data = h.docs.map((p) => p.data() as IUserDto);

            const us = data.sort((a, b) => {
               if (a.nome < b.nome) {
                  return -1;
               }
            });
            setListUser(
               us.sort((a, b) => {
                  if (b < a) {
                     return -1;
                  }
               })
            );
         });
      return () => ld();
   }, [user]);

   useEffect(() => {
      setLoading(true);
   }, []);

   const signOut = useCallback(async () => {
      await AsyncStorage.removeItem(User_Collection);

      setUser(null);
   }, []);

   const updateUser = useCallback(async (user: IUserDto) => {
      await AsyncStorage.setItem(User_Collection, JSON.stringify(user));

      setUser(user);
   }, []);

   return (
      <AuthContext.Provider
         value={{
            user,
            loading,
            signIn,
            signOut,
            updateUser,
            listUser,
            transactionAdd,
            orderB2b,
            orderIndicacao,
            orderTransaction,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export function useAuth(): AuthContexData {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error("useAuth must be used with ..");
   }

   return context;
}
