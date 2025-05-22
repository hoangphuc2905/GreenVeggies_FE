const translateUnit = (unit) => {
  const unitTranslations = {
    piece: "cái",
    kg: "kg",
    gram: "gram",
    liter: "lít",
    ml: "ml",
    pack: "gói",
    bundle: "bó",
    bottle: "chai",
    packet: "túi",
  };

  return unitTranslations[unit] || unit;
};

export default translateUnit;
