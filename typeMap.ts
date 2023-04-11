export const typeMap = {
  "Array<Attachment>": "{rid: string}[]",
  "Array<Boolean>": "boolean[]",
  "Array<Byte>": "Uint8Array[]",
  "Array<Date>": "Date[]",
  "Array<Decimal>": "number[]",
  "Array<Double>": "number[]",
  "Array<Float>": "number[]",
  "Array<Integer>": "number[]",
  "Array<LocalDate>": "Date[]",
  "Array<Long>": "number[]",
  "Array<Short>": "number[]",
  "Array<String>": "string[]",
  "Array<Timestamp>": "Date[]",
  "Attachment": "{rid: string}",
  "Boolean": "boolean",
  "Byte": "Uint8Array",
  "Date": "Date",
  "Decimal": "number",
  "Double": "number",
  "Float": "number",
  "Integer": "number",
  "LocalDate": "Date",
  "Long": "number",
  "Null": "null",
  "Short": "number",
  "String": "string",
  "Timestamp": "Date"
}

export const typeMapDateAsString = {
  ...typeMap,
  "Array<Date>": "string[]",
  "Array<LocalDate>": "string[]",
  "Date": "string",
  "LocalDate": "string",
  "Timestamp": "string"
}