import { useRef, useState } from "react";

export interface ModalConfigType {
  type: string;
  title?: string;
  size?: string;
  data?: unknown;
}

export interface ModalWrapperRef {
  open: () => void;
  close: () => void;
}

export const useModal = () => {
  const modalRef = useRef<ModalWrapperRef>(null);

  const [modalConfig, setModalConfig] = useState<ModalConfigType>({
    type: "",
    title: "",
    size: "max-w-m",
    data: null,
  });

  const onShowModal = (
    type: string,
    title?: string,
    size?: string,
    data: unknown = null
  ) => {
    setModalConfig({ type, title, size, data });
    modalRef.current?.open();
  };

  const onHideModal = () => {
    setModalConfig({ type: "", title: "", size: "", data: null });
    modalRef.current?.close();
  };

  return { modalRef, modalConfig, onHideModal, onShowModal };
};
