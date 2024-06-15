import { motion } from "framer-motion";
import { PropsWithChildren, useState } from "react";
import tailwindConfig from "tailwind.config";
import Chevron from "../assets/icons/chevron.svg";

interface PopupProps {
  open: boolean;
}

function Popup(props: PropsWithChildren<PopupProps>) {
  const { children, open } = props;

  return (
    <motion.div
      tabIndex={0}
      className="absolute z-10 flex flex-col rounded bg-white right-0 max-h-28 w-full gap-2 overflow-auto pb-4 pt-3 md:max-h-60"
      style={{
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        pointerEvents: open ? "auto" : "none",
      }}
      animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.9 }}
    >
      {children}
    </motion.div>
  );
}

interface OptionProps {
  selected: boolean;
  onClick: () => void;
}

function Option(props: PropsWithChildren<OptionProps>) {
  const { selected, onClick, children } = props;
  const { white, grey } = tailwindConfig.theme.extend.colors;

  return (
    <motion.button
      className="px-3 py-1 text-left"
      initial={{ backgroundColor: white }}
      whileHover={{ backgroundColor: grey }}
      style={{ fontWeight: selected ? "bold" : "normal" }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

interface Props<T> {
  label?: string;
  placeholder?: string;
  options: { value: T; label: string }[];
  selected?: T;
  onSelect: (v: T) => void;
  className?: string;
}

export default function Select<T extends string | number>(props: Props<T>) {
  const {
    className = "",
    label,
    placeholder,
    options,
    selected,
    onSelect,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find((v) => v.value === selected)?.label;

  return (
    <div
      className={`relative w-full ${className}`}
      onBlur={(e) => {
        // Close if clicked outside of element, exclude children
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      {label && (
        <span className={`mb-1 block font-medium text-darkBlue md:mb-2`}>
          {label}
        </span>
      )}

      <button
        className="flex h-[36px] w-full items-center justify-between rounded-md border-[1px] border-black px-3 outline-none md:h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedLabel ?? placeholder}
        </span>

        <motion.div
          animate={{ transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)" }}
        >
          <Chevron className="h-[15px]" />
        </motion.div>
      </button>

      <Popup open={isOpen}>
        {options.map((v) => (
          <Option
            key={v.label}
            onClick={() => {
              onSelect(v.value);
              setIsOpen(false);
            }}
            selected={v.value === selected}
          >
            {v.label}
          </Option>
        ))}

        {options.length === 0 && (
          <span className="px-3 py-1 text-left">No options</span>
        )}
      </Popup>
    </div>
  );
}
