"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { IconType, SideNav, SideNavItem } from "@gitcoin/ui";
import { Address, Hex } from "viem";
import { useAccount } from "wagmi";
import { EditProgramModal, ProgramDetails } from "@/components/EditProgramModal";

interface ProgramItem {
  name: string;
  chainId: number;
  programId: string;
  iconType?: IconType;
  admins: Address[];
  owner: Address;
}

interface RoundItem {
  name: string;
  chainId: number;
  roundId: string;
  iconType?: IconType;
}

const getProgramDetailsFromId = (
  programId?: string,
  connectedAddress?: Address,
  programItems?: ProgramItem[],
): ProgramDetails => {
  const program = programItems?.find((item) => item.programId === programId);
  return {
    name: program?.name ?? "",
    chainId: program?.chainId ?? 0,
    admins: program?.admins ?? [],
    isProgramOwner: program?.owner?.toLowerCase() === connectedAddress?.toLowerCase(),
    programId: program?.programId as Hex,
  };
};

export const AdminSideNav = ({
  programItems = [],
  roundItems = [],
  refetch,
}: {
  programItems: ProgramItem[];
  roundItems: RoundItem[];
  refetch: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  const [isEditProgramModalOpen, setIsEditProgramModalOpen] = useState(false);

  const [programDetails, setProgramDetails] = useState<ProgramDetails>(
    getProgramDetailsFromId(undefined, undefined, programItems),
  );
  const { address } = useAccount();
  const onClick = (id: string | undefined) => {
    if (id) {
      if (id.includes("manage-program")) {
        const programId = id.split("/")[2];
        setIsEditProgramModalOpen(true);
        setProgramDetails(getProgramDetailsFromId(programId, address, programItems));
      } else {
        navigate(id);
      }
    }
  };

  useEffect(() => {
    const programId = programDetails.programId;
    if (programId) {
      setProgramDetails(getProgramDetailsFromId(programId, address, programItems));
    }
  }, [programItems]);

  const items = useMemo<SideNavItem[]>(
    () => [
      {
        content: "Home",
        id: "/",
        iconType: IconType.HOME,
      },
      {
        content: "My Programs",
        id: "/",
        iconType: IconType.BRIEFCASE,
        items: programItems.map(({ name, chainId, programId, iconType }) => ({
          content: name,
          id: `/${chainId}/${programId}/manage-program`,
          iconType,
        })),
      },
      {
        content: "My Rounds",
        id: "/",
        iconType: IconType.COLLECTION,
        items: roundItems.map(({ name, chainId, roundId, iconType }) => ({
          content: name,
          id: `/${chainId}/${roundId}/manage-round`,
          iconType,
        })),
      },
    ],
    [programItems, roundItems],
  );

  return (
    <>
      <SideNav className="w-72" items={items} onClick={(id) => onClick(id)} />
      <EditProgramModal
        isOpen={isEditProgramModalOpen}
        onOpenChange={setIsEditProgramModalOpen}
        programDetails={programDetails}
        refetch={refetch}
      />
    </>
  );
};
