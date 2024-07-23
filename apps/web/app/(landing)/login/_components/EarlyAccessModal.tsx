import { Modal, useModal } from "@openstudio/ui/components/Modal";
import { SectionDescription } from "@openstudio/ui/components/Typography";
import { Button } from "@openstudio/ui/components/Button";
import { useEffect } from "react";

export function EarlyAccessModal() {
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    openModal();
  }, [openModal]);

  return (
    <Modal title="Early Access" isOpen={isModalOpen} hideModal={closeModal}>
      <div className="mt-2">
        <SectionDescription>
          Open Studio is in early access, awaiting full approval from Google to
          use Youtube Data API. Till then you will see a warning sign when
          signing in. To get past this warning, click {'"'}Advanced
          {'"'} and then {'"'}Go to Open Studio{'"'}.
        </SectionDescription>
        <div className="mt-4">
          <Button onClick={closeModal} size="xl">
            I understand I will see a warning message when signing in
          </Button>
        </div>
      </div>
    </Modal>
  );
}
