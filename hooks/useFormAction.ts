"use client"

import { useEffect } from "react";
import { useActionState } from "react";
import { FormState } from "@/actions/login";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>

type UseFormActionOptions = {
  onSuccess?: (state: FormState) => void;
  onError?: (state: FormState) => void;
  onSettled?: (state: FormState) => void; // Selalu jalan baik sukses maupun gagal
}


function useFormAction(act: Action, options?: UseFormActionOptions) {
  const interceptedAct = async (prev: FormState, formData: FormData) => {
    const nextState = await act(prev, formData);

    if (nextState.success) {
      options?.onSuccess?.(nextState);
    }
    else {
      options?.onError?.(nextState);
    }

    options?.onSettled?.(nextState);

    return nextState;
  };

  const [state, formAction, isPending] = useActionState<FormState, FormData>(interceptedAct, {
    success: false,
    message: ""
  });



  return {
    formAction,
    isPending,
    state,
  }
}

export {
  useFormAction
}