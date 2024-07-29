"use client";

import { Modal, useModal } from "@openstudio/ui/components/Modal";
import { SectionDescription } from "@openstudio/ui/components/Typography";
import { Button } from "@openstudio/ui/components/Button";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export function EarlyAccessModal() {
  const t = useTranslations("LOGIN");
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    openModal();
  }, [openModal]);

  return (
    <Modal
      title={t("EARLY_ACCESS_MODAL.TITLE")}
      isOpen={isModalOpen}
      hideModal={closeModal}
    >
      <div className="mt-2">
        <SectionDescription>
          {t("EARLY_ACCESS_MODAL.DESCRIPTION")}
        </SectionDescription>
        <div className="mt-4 mr-4">
          <Button
            onClick={closeModal}
            size="xl"
            className="truncate overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {t("EARLY_ACCESS_MODAL.UNDERSTAND")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
