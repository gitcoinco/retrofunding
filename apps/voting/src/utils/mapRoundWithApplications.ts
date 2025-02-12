import {
  APIRetroApplication,
  APIRetroRoundWithApplications,
  RetroRoundWithApplications,
} from "@/types";

const IPFS_URL = "https://ipfs.io/ipfs";

const mapAplications = (applications: APIRetroApplication[]) =>
  applications.map((application) => {
    const { id, metadata } = application;
    const { signature, application: applicationData } = metadata;
    const { round, answers, project, recipient } = applicationData;
    const {
      id: projectId,
      title,
      description,
      logoImg,
      bannerImg,
      metaPtr,
      website,
      createdAt,
      credentials,
      lastUpdated,
    } = project;

    return {
      id,
      signature,
      round,
      answers,
      projectId,
      title,
      description,
      logoImg: `${IPFS_URL}/${logoImg}`,
      bannerImg: `${IPFS_URL}/${bannerImg}`,
      metaPtr,
      website,
      createdAt,
      credentials,
      lastUpdated,
      recipient,
    };
  });

export const mapRoundWithApplications = (
  round: APIRetroRoundWithApplications,
): RetroRoundWithApplications => {
  const {
    id,
    roundMetadata,
    createdAtBlock,
    applications,
    strategyName,
    applicationsEndTime,
    applicationsStartTime,
    donationsEndTime,
    donationsStartTime,
    roles,
  } = round;

  const {
    name,
    retroFundingConfig,
    eligibility,
    feesAddress,
    feesPercentage,
    programContractAddress,
    roundType,
  } = roundMetadata;

  const { roundName } = retroFundingConfig;
  const { description, requirements } = eligibility;
  const { coverImage, impactMetrics, program, payoutToken } = retroFundingConfig;
  const { chainId, programId, programName } = program;

  return {
    id,
    name,
    roundName,
    description,
    chainId,
    programId,
    programName,
    strategyName,
    applicationsEndTime,
    applicationsStartTime,
    donationsEndTime,
    donationsStartTime,
    roles,
    requirements,
    coverImage,
    impactMetrics,
    payoutToken,
    feesAddress,
    feesPercentage,
    programContractAddress,
    projectId: programId,
    roundType,
    createdAtBlock,
    applications: mapAplications(applications),
  };
};
