import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

jest.mock("../utils/hooks/useGetEvents");

const useGetEvents = require("../utils/hooks/useGetEvents");

describe("Home", () => {
  it("renders a heading", () => {
    useGetEvents.default.mockReturnValue({ events: [], loading: false });

    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it("renders a loading spinner", () => {
    useGetEvents.default.mockReturnValue({ events: [], loading: true });

    render(<Home />);

    const spinner = screen.getByText("test-svg");

    expect(spinner).toBeInTheDocument();
  });

  it("renders a list of events", () => {
    useGetEvents.default.mockReturnValue({
      events: [
        { id: 1, name: "Event 1", imageUrl: "https://example.com/image1.jpg" },
        { id: 2, name: "Event 2", imageUrl: "https://example.com/image2.jpg" },
      ],
      loading: false,
    });

    render(<Home />);

    const event1 = screen.getByText("Event 1");
    const event2 = screen.getByText("Event 2");

    expect(event1).toBeInTheDocument();
    expect(event2).toBeInTheDocument();
  });

  it("renders a message if no events", () => {
    useGetEvents.default.mockReturnValue({
      events: [],
      loading: false,
    });

    render(<Home />);

    const text = screen.getByText("No events found!");

    expect(text).toBeInTheDocument();
  });
});
