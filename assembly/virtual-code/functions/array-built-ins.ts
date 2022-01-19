import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";
import { jsonToInt32, jsonToString } from "./utils";

enum ArrayElementType {
  ANY = 0,
  I32 = 1,
  U32 = 2,
  F32 = 3,
  F64 = 4,
}

enum SortOrder {
  ASCENDING = 1,
  DESCENDING = -1,
}

class SortElement<T> {
  constructor(public element: T, public index: i32) {}
}

export function compareString(
  str1: string,
  index1: usize,
  str2: string,
  index2: usize,
  len: usize
): i32 {
  var ptr1 = changetype<usize>(str1) + (index1 << 1);
  var ptr2 = changetype<usize>(str2) + (index2 << 1);
  if (ASC_SHRINK_LEVEL < 2) {
    if (len >= 4 && !((ptr1 & 7) | (ptr2 & 7))) {
      do {
        if (load<u64>(ptr1) != load<u64>(ptr2)) break;
        ptr1 += 8;
        ptr2 += 8;
        len -= 4;
      } while (len >= 4);
    }
  }
  while (len--) {
    let a = <i32>load<u16>(ptr1);
    let b = <i32>load<u16>(ptr2);
    if (a != b) return a - b;
    ptr1 += 2;
    ptr2 += 2;
  }
  return 0;
}

function comparator_str(
  el1: SortElement<string>,
  el2: SortElement<string>
): i32 {
  const a = el1.element;
  const b = el2.element;
  if (a === b || a === null || b === null) return 0;
  var a_len = changetype<string>(a).length;
  var b_len = changetype<string>(b).length;
  if (!(a_len | b_len)) return 0;
  if (!a_len) return -1;
  if (!b_len) return 1;
  let res = compareString(changetype<string>(a), 0, changetype<string>(b), 0, <
    usize
  >min(a_len, b_len));
  return res ? res : a_len - b_len;
}

//@ts-ignore
@inline
function comparator_str_desc(
  el1: SortElement<string>,
  el2: SortElement<string>
): i32 {
  return comparator_str(el1, el2) * -1;
}
//@ts-ignore
@inline
function comparator_i32(el1: Value, el2: Value): i32 {
  const a = <i32>(<JSON.Integer>el1).valueOf();
  const b = <i32>(<JSON.Integer>el2).valueOf();
  return i32(a > b) - i32(a < b);
}
//@ts-ignore
@inline
function comparator_i32_desc(el1: Value, el2: Value): i32 {
  return comparator_i32(el1, el2) * -1;
}
//@ts-ignore
@inline
function comparator_u32(el1: Value, el2: Value): i32 {
  const a = <u32>(<JSON.Integer>el1).valueOf();
  const b = <u32>(<JSON.Integer>el2).valueOf();
  return i32(a > b) - i32(a < b);
}
//@ts-ignore
@inline
function comparator_u32_desc(el1: Value, el2: Value): i32 {
  return comparator_u32(el1, el2) * -1;
}
//@ts-ignore
@inline
function comparator_f32(el1: Value, el2: Value): i32 {
  let a: f32;
  let b: f32;
  
  if (el1.isString) {
    a = <f32>parseFloat((<JSON.Str>el1).valueOf());
  } else {
    a = <f32>(<JSON.Num>el1).valueOf();
  }

  if (el2.isString) {
    b = <f32>parseFloat((<JSON.Str>el2).valueOf());
  } else {
    b = <f32>(<JSON.Num>el2).valueOf();
  }

  return i32(a > b) - i32(a < b);
}
//@ts-ignore
@inline
function comparator_f32_desc(el1: Value, el2: Value): i32 {
  return comparator_f32(el1, el2) * -1;
}
//@ts-ignore
@inline
function comparator_f64(el1: Value, el2: Value): i32 {
  let a: f64;
  let b: f64;
  
  if (el1.isString) {
    a = <f64>parseFloat((<JSON.Str>el1).valueOf());
  } else {
    a = <f64>(<JSON.Num>el1).valueOf();
  }

  if (el2.isString) {
    b = <f64>parseFloat((<JSON.Str>el2).valueOf());
  } else {
    b = <f64>(<JSON.Num>el2).valueOf();
  }

  return i32(a > b) - i32(a < b);
}
//@ts-ignore
@inline
function comparator_f64_desc(el1: Value, el2: Value): i32 {
  return comparator_f64(el1, el2) * -1;
}

function sortAny(arrayRaw: Value[], sortOrder: SortOrder): Value[] {
  const array = arrayRaw.map<SortElement<string>>(
    (element: Value, index: i32): SortElement<string> =>
      new SortElement(element.toString(), index)
  );
  array.sort(
    sortOrder == SortOrder.ASCENDING ? comparator_str : comparator_str_desc
  );
  const bkpArray: Value[] = arrayRaw.slice(0);
  for (let i = 0; i < array.length; i += 1) {
    const sortElement = array[i];
    arrayRaw[i] = bkpArray[sortElement.index];
  }
  return arrayRaw;
}

function sort(
  arrayValue: Value,
  elementType: ArrayElementType,
  sortOrder: SortOrder = SortOrder.ASCENDING
): Value {
  const arrayRaw = (<JSON.Arr>arrayValue).valueOf();
  switch (elementType) {
    case ArrayElementType.ANY:
      (<JSON.Arr>arrayValue)._arr = sortAny(arrayRaw, sortOrder);
      break;
    case ArrayElementType.I32:
      (<JSON.Arr>arrayValue)._arr = arrayRaw.sort(
        sortOrder == SortOrder.DESCENDING ? comparator_i32_desc:comparator_i32
      );
      break;
    case ArrayElementType.U32:
      (<JSON.Arr>arrayValue)._arr = arrayRaw.sort(
        sortOrder == SortOrder.DESCENDING ? comparator_u32_desc:comparator_u32
      );
      break;
    case ArrayElementType.F32:
      (<JSON.Arr>arrayValue)._arr = arrayRaw.sort(
        sortOrder == SortOrder.DESCENDING ? comparator_f32_desc:comparator_f32
      );
      break;
    case ArrayElementType.F64:
      (<JSON.Arr>arrayValue)._arr = arrayRaw.sort(
        sortOrder == SortOrder.DESCENDING ? comparator_f64_desc:comparator_f64
      );
      break;
  }
  return arrayValue;
}

/**
 * Returns a boolean indicating whether all the specified values are in an
 * array. Last element of the `operands` is the target array
 */
export const _in = (operands: Value[]): boolean => {
  const arrayValue = operands[operands.length - 1];
  if (arrayValue.isArr) {
    const array = (<JSON.Arr>arrayValue).valueOf();
    if (array.length > 0) {
      for (let i: i32 = 0; i < operands.length - 1; i++) {
        const value = operands[i].toString();
        let found = false;
        for (let j: i32 = 0; j < array.length; j++) {
          if (array[j].toString() == value) {
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
};

/**
 * Returns a boolean indicating whether all the specified values are in an
 * array. Last element of the `operands` is the target array
 */
export const $in = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => new JSON.Bool(_in(operands));

/**
 * Inverted result of $in
 */
export const $nin = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => new JSON.Bool(!_in(operands));

/**
 * This function sorts the elements of an array and returns a new sorted array.
 * The default sort order is built upon converting the elements into strings,
 * then comparing their sequences of UTF-16 code units values.
 *
 * <sortOrder:number> can have one of the following values:
 *  0 (default) to specify default order.
 *  1 to specify ascending order. Using (a, b) => (a > b ? 1 : a === b ? 0 : -1)
 * -1 to specify descending order. Using (a, b) => a > b ? -1 : a === b ? 0 : 1)
 *
 * <elementType:string> can have one of the following values:
 *
 * any (default) - Use source array as it is.
 * i32 - Convert elements to Int32Array and sort then return orignal sorted elements
 * u32 - Convert elements to Uint32Array and sort then return orignal sorted elements
 * f32 - Convert elements to Float32Array and sort then return orignal sorted elements
 * f64 - Convert elements to Float64Array and sort then return orignal sorted elements
 * Specifying element type will not change the original elements instead
 * create a new reference TypedArray for sorting then reorder the result array.
 */
export const $sort = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const arrayValue = operands[0];
  const sortOrderValue = operands.length > 1 ? operands[1] : new JSON.Num(1);
  const elementTypeValue =
    operands.length > 2 ? operands[2] : new JSON.Str("any");
  if (arrayValue == null || !arrayValue.isArr) {
    return arrayValue;
  }
  const sortOrder = jsonToInt32(sortOrderValue);
  const elementTypeStr = jsonToString(elementTypeValue);
  let elementType: i32 = ArrayElementType.ANY;
  if (elementTypeStr == "any") {
    elementType = ArrayElementType.ANY;
  } else if (elementTypeStr == "i32") {
    elementType = ArrayElementType.I32;
  } else if (elementTypeStr == "u32") {
    elementType = ArrayElementType.U32;
  } else if (elementTypeStr == "f32") {
    elementType = ArrayElementType.F32;
  } else if (elementTypeStr == "f64") {
    elementType = ArrayElementType.F64;
  } else {
    throw new Error(`Invalid array element type:${elementTypeStr}`);
  }
  return sort(arrayValue, elementType, sortOrder);
};

// export default arrayBuiltIns;

// export type ArrayBuiltIns = typeof arrayBuiltIns;
// export type ArrayBuiltInKeys = keyof ArrayBuiltIns;
// export type ArrayBuiltInCode = {
//   [K in ArrayBuiltInKeys]?: (
//     | Parameters<ArrayBuiltIns[K]>[0][number]
//     | VirtualCode
//   )[];
// };
