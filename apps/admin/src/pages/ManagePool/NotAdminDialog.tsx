"use client";

import { Dialog, DialogHeader, DialogTitle, DialogDescription, Modal, Button } from "@gitcoin/ui";
import { Icon, IconType } from "@gitcoin/ui";
import { useDisconnect } from "wagmi";

export const NotAdminDialog = ({ isOpen }: { isOpen: boolean }) => {
  const { disconnect: disconnectWallet } = useDisconnect();
  return (
    <Dialog open={isOpen} onOpenChange={() => disconnectWallet()}>
      <Modal className="max-w-[480px] p-6">
        <div className="flex flex-col items-center gap-6 text-start">
          <DialogHeader className="flex flex-col items-start gap-4 text-start">
            <DialogTitle className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon type={IconType.EXCLAMATION_CIRCLE} className="fill-purple-700" />
                <span className="font-ui-sans text-lg font-medium text-black">
                  Wallet not eligible to manage pool
                </span>
              </div>
              <Icon
                type={IconType.X}
                className="cursor-pointer fill-black"
                onClick={() => disconnectWallet()}
              />
            </DialogTitle>
            <DialogDescription className="flex max-w-[432px] flex-col gap-4">
              <span className="font-ui-sans text-sm font-normal leading-tight text-grey-900">
                Your wallet isn’t registered to manage this pool.
              </span>
              <span className="font-ui-sans text-sm font-normal leading-tight text-grey-900">
                Double-check that you’ve connected the correct wallet and try again. If the issue
                persists, please contact this round’s administrator for support.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <Button
              value="Disconnect wallet"
              className="rounded-lg border border-grey-100"
              variant="ghost"
              onClick={() => disconnectWallet()}
            />
          </div>
        </div>
      </Modal>
    </Dialog>
  );
};
