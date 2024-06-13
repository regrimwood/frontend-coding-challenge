import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

jest.mock("../utils/hooks/useGetEvents");

const useGetEvents = require("../utils/hooks/useGetEvents");

describe("Home", () => {
  it("renders a heading", () => {
    useGetEvents.default.mockReturnValue({ events: [], isLoading: false });

    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
