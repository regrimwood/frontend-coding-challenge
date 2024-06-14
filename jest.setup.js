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
      ul: ({ children }) => (
        <div className="mocked-framer-motion-ul">{children}</div>
      ),
      li: ({ children }) => (
        <div className="mocked-framer-motion-li">{children}</div>
      ),
    },
  };
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
