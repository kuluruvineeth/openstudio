import { Modal, useModal } from "@openstudio/ui/components/Modal";
import { useCallback } from "react";
import { Pricing } from "./Pricing";

export function usePremiumModal() {
  const { isModalOpen, openModal, closeModal } = useModal();

  const PremiumModal = useCallback(() => {
    return (
      <Modal isOpen={isModalOpen} hideModal={closeModal} title="" size="6xl">
        <Pricing />
      </Modal>
    );
  }, [closeModal, isModalOpen]);

  return {
    openModal,
    PremiumModal,
  };
}
