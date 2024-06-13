import "@testing-library/jest-dom";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return {
    __esModule: true,
    ...actual,
    AnimatePresence: ({ children }) => (
      <div className="mocked-framer-motion-AnimatePresence">{children}</div>
    ),
    motion: {
      ...actual.motion,
      div: ({ children }) => (
        <div className="mocked-framer-motion-div">{children}</div>
      ),
    },
  };
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
