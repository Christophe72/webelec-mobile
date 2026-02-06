import React from "react";
import { render, screen } from "@testing-library/react";
import RgieQueryPanel from "./RgieQueryPanel";

jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({ status: "unauthenticated", token: null }),
}));

test("renders RgieQueryPanel component", () => {
  render(<RgieQueryPanel />);
  const heading = screen.getByText(/Résultat/i);
  expect(heading).toBeInTheDocument();
  const button = screen.getByRole("button", { name: /Analyser via RGIE/i });
  expect(button).toBeInTheDocument();
});
