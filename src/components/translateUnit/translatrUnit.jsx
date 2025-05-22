const translateUnit = (unit) => {
  const unitTranslations = {
    piece: "Trái",
    kg: "Kg",
    gram: "Gram",
    liter: "Lít",
    ml: "Ml",
    pack: "Hộp",
    bundle: "Bó",
    bottle: "Chai",
    packet: "Gói",
  };

  return unitTranslations[unit] || unit;
};

export default translateUnit;
