import { JSON } from "assemblyscript-json";

export function f(value: f64): JSON.Value {
  return new JSON.Num(value);
}
export function i(value: i64): JSON.Value {
  return new JSON.Integer(value);
}
export function s(value: string): JSON.Value {
  return new JSON.Str(value);
}
export function b(value: boolean): JSON.Value {
  return new JSON.Bool(value);
}
export function Null(): JSON.Value {
  return new JSON.Null();
}

/* function encodeObj(obj: any) {
  switch (typeof obj) {
    case "string":
      return s(obj);
    case "number":
      return f(obj);
    case "boolean":
      return b(obj);
    case "object":
      if (!obj) {
        return Null();
      }
      if (Array.isArray(obj)) {
        obj.forEach(encodeObj);
        return new JSON.Arr();
      }
      const jsonObj: JSON.Obj = new JSON.Obj();
      for (const key in obj) {
        jsonObj.set(key, encodeObj(obj[key]));
      }
      return jsonObj;
  }
} */

export function o(value: string): JSON.Value {
  return JSON.parse(value);
}
