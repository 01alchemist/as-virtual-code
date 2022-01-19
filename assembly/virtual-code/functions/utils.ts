import { JSON } from "assemblyscript-json";
import { Value } from "../types";

export function map_f64(values: Value[]): number[] {
  const result: number[] = [];
  for (let i: i32 = 0; i < values.length; i++) {
    result[i] = jsonToNumber(values[i]);
  }
  return result;
}

export function map_i32(values: Value[]): i32[] {
  const result: i32[] = [];
  for (let i: i32 = 0; i < values.length; i++) {
    result[i] = jsonToInt32(values[i]);
  }
  return result;
}
export function map_str(values: Value[]): string[] {
  const result: string[] = [];
  for (let i: i32 = 0; i < values.length; i++) {
    result[i] = values[i].toString();
  }
  return result;
}

export function jsonToNumber(value: Value): f64 {
  if (value.isNum) {
    return (<JSON.Num>value).valueOf();
  }
  if (value.isInteger) {
    return <f64>(<JSON.Integer>value).valueOf();
  }
  return 0.0;
}

export function toJsonNumber(value: number): Value {
  return new JSON.Num(value);
}

export function jsonToInt32(value: Value): i32 {
  if (value.isNum) {
    return <i32>(<JSON.Num>value).valueOf();
  }
  if (value.isInteger) {
    return <i32>(<JSON.Integer>value).valueOf();
  }
  return 0;
}

export function jsonToBigInt(value: Value): i64 {
  if (value.isNum) {
    return <i64>(<JSON.Num>value).valueOf();
  }
  if (value.isInteger) {
    return <i64>(<JSON.Integer>value).valueOf();
  }
  return 0;
}

export function jsonToString(value: Value): string {
  if (value.isString) {
    return (<JSON.Str>value).valueOf();
  }
  return "";
}

export function toJsonString(value: string): Value {
  return new JSON.Str(value);
}

export function jsonToBoolean(value: Value, _default: bool = false): bool {
  if (value.isBool) {
    return (<JSON.Bool>value).valueOf();
  }
  return _default;
}

export function toJsonBoolean(value: bool): Value {
  return new JSON.Bool(value);
}

export function jsonToArray<T extends Value>(value: JSON.Value): T[] {
  if (value.isArr) {
    return changetype<T[]>((<JSON.Arr>value).valueOf());
  }
  return [];
}
export function jsonToNull(value: Value): null {
  if (value.isNull) {
    return null;
  }
  throw new Error(`Expected null but found '${value.toString()}'`);
}
/**
 * Get deep property by path
 * @param obj
 * @param path
 */
export function get(obj: JSON.Value, path: string): JSON.Value | null {
  if (!obj.isObj) {
    throw new Error(`Cannot get property from a non-object`);
  }
  if (path === "") {
    throw new Error(`Invalid path provided, path=${path}`);
  }
  const fragments = path.split(".");
  let currentChild: JSON.Value | null = obj;
  let index = 0;
  while (index < fragments.length) {
    if (currentChild === null || currentChild.isNull) {
      return currentChild;
    }
    const fragment = fragments[index];
    index += 1;
    if (currentChild.isObj) {
      currentChild = (<JSON.Obj>currentChild).get(fragment);
    } else {
      currentChild = null;
    }
  }
  return currentChild;
}

export function set(obj: JSON.Value, path: string, value: JSON.Value): void {
  if (!obj.isObj) {
    throw new Error(`Cannot set property on a non-object`);
  }
  if (path === "") {
    throw new Error(`Invalid path provided, path=${path}`);
  }
  if (path.indexOf(".") == -1) {
    (<JSON.Obj>obj).set(path, value);
    return;
  }
  const fragments = path.split(".");
  let currentChild: JSON.Value | null = obj;
  let index = 0;
  while (index < fragments.length) {
    if (currentChild === null || currentChild.isNull) {
      return;
    }
    const fragment = fragments[index];
    index += 1;
    if (currentChild.isObj) {
      currentChild = (<JSON.Obj>currentChild).get(fragment);
    } else {
      currentChild = null;
    }
  }
  if (currentChild !== null && currentChild.isObj) {
    (<JSON.Obj>currentChild).set(fragments[fragments.length - 1], value);
  }
}
