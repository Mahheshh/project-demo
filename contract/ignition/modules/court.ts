import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CourtModule = buildModule("LockModule", (m) => {
  
  const court = m.contract("Court", [], {});

  return { court };
});

export default CourtModule;
