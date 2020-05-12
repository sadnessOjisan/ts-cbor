type MAJOR_TYPE_IDENTIFIER_TYPE = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type MAJOR_TYPE_NAME_TYPE =
  | "unsignedInteger"
  | "negativeInteger"
  | "byte"
  | "text";

type MAJOR_TYPE_TYPE = {
  [key in MAJOR_TYPE_NAME_TYPE]: {
    type: MAJOR_TYPE_IDENTIFIER_TYPE;
    description: string;
  };
};

export const majorType: MAJOR_TYPE_TYPE = {
  unsignedInteger: {
    type: 0,
    description: "正の数",
  },
  negativeInteger: {
    type: 1,
    description: "負の数",
  },
  byte: {
    type: 2,
    description: "byte",
  },
  text: {
    type: 3,
    description: "文字列",
  },
};
