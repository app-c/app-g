/* eslint-disable camelcase */
export type TransactionNavigtionsProps = {
  prestador_id?: string;
  avatar_url?: string;
  logoUrl?: string;
  nome?: string;
  workName?: string;
};

export type OrderNavigationIndication = {
  quemIndicou: string;
  id: string;
};

type Sucess = {
  workName: string;
  nome: string;
  description: string;
};

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      INÍCIO: undefined;
      POSTS: undefined;
      "VALIDE SUA PRESENSA": undefined;
      NEGOCIAR: undefined;
      INDICAÇÕES: undefined;
      classificaçao: undefined;
      B2B: undefined;
      PERFIL: undefined;
      ranking: undefined;
      user: undefined;
      presenca: undefined;
      updateSenha: undefined;
      delete: undefined;
      product: TransactionNavigtionsProps;
      order: undefined;
      Inicio: undefined;
      indication: OrderNavigationIndication;
      Transaction: TransactionNavigtionsProps;
      orderB2b: TransactionNavigtionsProps;
      Post: undefined;
      Membros: undefined;
      sucess: Sucess;
    }
  }
}
