import { Dialog, DialogHeader, DialogTitle, DialogDescription, Modal, Button } from "@gitcoin/ui";

export const SumbitBalllotDialog = ({
  isOpen,
  onOpenChange,
  modalTitle,
  modalDescription,
  buttonText,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  modalTitle: string;
  modalDescription: string;
  buttonText: string;
  onSubmit: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Modal showCloseButton={false} className="max-w-[414px] p-6">
        <div className="flex flex-col items-center gap-6 text-start">
          <DialogHeader className="flex max-w-[366px] flex-col items-start gap-2 text-start">
            <DialogTitle className="text-[18px]/[28px] font-medium">{modalTitle}</DialogTitle>
            <DialogDescription className="text-[14px]/[20px] text-grey-900">
              {modalDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-6">
            <Button
              value="Cancel"
              className="bg-red-50 text-red-700"
              variant="none"
              onClick={() => onOpenChange(false)}
            />
            <Button value={buttonText} variant="light-purple" onClick={onSubmit} />
          </div>
        </div>
      </Modal>
    </Dialog>
  );
};
