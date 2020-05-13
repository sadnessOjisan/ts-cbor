/**
 * CBORが規程するmajor type
 */
type MAJOR_TYPE_IDENTIFIER_TYPE = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * major type objectのkey
 */
type MAJOR_TYPE_NAME_TYPE =
  | "unsignedInteger"
  | "negativeInteger"
  | "byte"
  | "text"
  | "array"
  | "primitive";

/**
 * major type objectの型
 */
type MAJOR_TYPE_TYPE = {
  [key in MAJOR_TYPE_NAME_TYPE]: {
    type: MAJOR_TYPE_IDENTIFIER_TYPE;
    description: string;
  };
};

/**
 * major type object
 */
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
  array: {
    type: 4,
    description: "配列",
  },
  primitive: {
    type: 7,
    description: "primitive(true/false/undefined/null)",
  },
};

export const PRIMITIVE_TYPE = {
  FALSE: 20,
  TRUE: 21,
  NULL: 22,
  UNDEFINED: 23,
};
