"use client";

import { Modal, useModal } from "@openstudio/ui/components/Modal";
import { SectionDescription } from "@openstudio/ui/components/Typography";
import { Button } from "@openstudio/ui/components/ui/button";
import { PremiumAlertWithData } from "../../../premium/_components/PremiumAlert";

export function BulkRunRules() {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <Button type="button" variant={"outline"} onClick={openModal}>
        Bulk Run on Comments
      </Button>
      <Modal
        isOpen={isModalOpen}
        hideModal={closeModal}
        title="Run against all comments"
      >
        <>
          <SectionDescription className="mt-2">
            If you want to select individual comments instead, go to the{" "}
            {`"Comments > All Comments"`} page, mark the comments you want to
            run rules on, and click the {`"Run AI Rules"`} button.
          </SectionDescription>
          <SectionDescription className="mt-2">
            This will not run on comments that already have an AI plan set.
          </SectionDescription>

          <div className="mt-4">
            <PremiumAlertWithData />
          </div>
        </>
      </Modal>
    </div>
  );
}
