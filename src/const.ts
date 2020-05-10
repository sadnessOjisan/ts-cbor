type MEJOR_TYPE_IDENTIFIER_TYPE = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type MEJOR_TYPE_NAME_TYPE = "unsignedInteger" | "negativeInteger";

type MEJOR_TYPE_TYPE = {
  [key in MEJOR_TYPE_NAME_TYPE]: {
    type: MEJOR_TYPE_IDENTIFIER_TYPE;
    description: string;
  };
};

export const mejorType: MEJOR_TYPE_TYPE = {
  unsignedInteger: {
    type: 0,
    description: "整数",
  },
  negativeInteger: {
    type: 1,
    description: "整数",
  },
};
