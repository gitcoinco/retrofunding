"use client";

import { NavLink } from "react-router";
import { CreateButton } from "gitcoin-ui";

export const CreateNewProgramButton = () => {
  return (
    <NavLink to="/create-program" style={{ cursor: "pointer" }}>
      <CreateButton>Create New Program</CreateButton>
    </NavLink>
  );
};
