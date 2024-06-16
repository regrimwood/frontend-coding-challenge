const alpha = (hex: string, opacity: number) => {
  if (!hex.match(/^#[a-fA-F0-9]{6}$/g)) {
    throw new Error("Invalid input");
  }

  const rgbHex = hex.slice(1).match(/.{1,2}/g);
  if (!rgbHex) {
    throw new Error("Invalid input");
  }

  const r = parseInt(rgbHex[0], 16);
  const g = parseInt(rgbHex[1], 16);
  const b = parseInt(rgbHex[2], 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default alpha;
