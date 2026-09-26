import type { UserType } from "@/type";

export interface MutationType {
  mutate: (
    data: unknown,
    options?: {
      onSuccess?: (res: {
        result: boolean;
        message: string;
        combined_order_id?: string;
        data?: unknown;
      }) => void;
      onError?: (error: unknown) => void;
    }
  ) => void;
  isPending: boolean;
}

export interface QueryType {
  data: {
    data?: unknown;
    meta?: unknown;
    google_client_id?: string;
  };
  error: unknown;
  isLoading: boolean;
}

export interface WithoutDataMutationType {
  mutate: () => void;
  isPending: boolean;
}

export interface MutationAuthType {
  mutate: (
    data: unknown,
    options?: {
      onSuccess?: (res: {
        result: boolean;
        message: string;
        data?: unknown;
        access_token?: string;
        user?: UserType;
      }) => void;
      onError?: (error: unknown) => void;
    }
  ) => void;
  isPending: boolean;
}
