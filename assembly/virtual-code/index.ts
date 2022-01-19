import { JSON } from "assemblyscript-json";
import { conditionalOperatorNames, functions } from "./functions";
import { get, set } from "./functions/utils";
import { Value, VirtualCode } from "./types";

// export declare function log(msg: string): void;

export enum EvaluationStatus {
  SUCCESS,
  FAILED,
}

export function statusCodeToString(status: EvaluationStatus): string {
  switch (status) {
    case EvaluationStatus.SUCCESS:
      return "SUCCESS";
    case EvaluationStatus.FAILED:
      return "FAILED";
    default:
      return "UNKNOWN";
  }
}

export class EvaluationResult {
  status: EvaluationStatus;
  message: string | null;
  store: EvaluationStore;
  context: EvaluationContext;
  return: JSON.Value;

  constructor(context: EvaluationContext, store: EvaluationStore) {
    this.context = context;
    this.store = store;
    this.status = EvaluationStatus.SUCCESS;
    this.return = new JSON.Null();
  }

  toString(): string {
    const status = statusCodeToString(this.status);
    let store = "";
    if (this.store != null) {
      const s: EvaluationStore = <EvaluationStore>this.store;
      store = s.toString();
    }
    let context = "";
    if (this.context != null) {
      const c: EvaluationContext = <EvaluationContext>this.context;
      context = c.toString();
    }
    if (this.return === null) {
      return `{"status":"${status}", "result": null, "store": ${store}}`;
    }
    return `{"status":"${status}", "result":"${this.return.toString()}", "store": ${store}}`;
  }
}

export function resultToString(result: EvaluationResult): string {
  return result.toString();
}

class ObjectMap {
  protected data: JSON.Obj;
  constructor(data: JSON.Obj = new JSON.Obj()) {
    this.data = data;
  }
  exists(name: string): boolean {
    return this.get(name) !== null;
  }
  get(name: string): JSON.Value | null {
    return get(this.data, name);
  }
  set(name: string, value: JSON.Value): void {
    set(this.data, name, value);
  }
  toString(): string {
    let str = "{";
    const keys = this.data.keys;
    for (let i: i32 = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.data.get(key);
      if (value) {
        str += `"${key}": "${value.toString()}"\n`;
      } else {
        str += `"${key}": "undefined"\n`;
      }
      if (i !== keys.length - 1) {
        str += ",";
      }
    }
    str += `}`;
    return str;
  }
}

export class EvaluationContext extends ObjectMap {
  private locked: bool = false;
  constructor(data: JSON.Obj = new JSON.Obj()) {
    super(data);
  }
  set(name: string, value: JSON.Value): void {
    if (this.locked == true) {
      throw new Error("Cannot set value in locked context");
    }
    set(this.data, name, value);
  }
  lock(): void {
    this.locked = true;
  }
  unlock(): void {
    this.locked = false;
  }
}

export class EvaluationStore extends ObjectMap {
  constructor(data: JSON.Obj = new JSON.Obj()) {
    super(data);
  }
}

export class EvaluationPayload {
  constructor(
    public code: JSON.Obj,
    public context: EvaluationContext,
    public store: EvaluationStore
  ) {}

  fromJSON(data: JSON.Obj): EvaluationPayload {
    if (data.isObj) {
      const code: JSON.Obj | null = data.get("code") as JSON.Obj;
      const ctxData: JSON.Obj | null = data.get("context") as JSON.Obj;
      const storeData: JSON.Obj | null = data.get("store") as JSON.Obj;
      if (code != null) {
        const context = new EvaluationContext(
          ctxData ? ctxData : new JSON.Obj()
        );
        const store = new EvaluationStore(
          storeData ? storeData : new JSON.Obj()
        );
        return new EvaluationPayload(code, context, store);
      }
      throw new Error(`Invalid payload, code is null`);
    }
    throw new Error(`Invalid payload, data not an object`);
  }

  fromString(data: string): EvaluationPayload {
    return this.fromJSON(<JSON.Obj>JSON.parse(data));
  }
}

export function evaluate(
  codeData: string,
  contextData: string,
  storeData: string
): EvaluationResult {
  const code = JSON.parse(codeData);
  const context = new EvaluationContext(<JSON.Obj>JSON.parse(contextData));
  const store = new EvaluationStore(<JSON.Obj>JSON.parse(storeData));
  return evaluateCode(code, context, store);
}

export function evaluateCode(
  code: VirtualCode,
  context: EvaluationContext,
  store: EvaluationStore
): EvaluationResult {
  const result = new EvaluationResult(context, store);
  if (code === null || code.isNull) {
    result.return = code;
    return result;
  }
  // If code is explicit boolean or number or falsy return it
  if (code.isBool || code.isNum || code.isInteger || code.isFloat) {
    result.return = code;
    return result;
  }

  if (code.isString) {
    const strValue = (<JSON.Str>code).valueOf();
    const token = parseIdentifier(strValue);
    if (token.isIdentifier) {
      let value: JSON.Value | null;
      if (token.name.startsWith("store.")) {
        value = store.get(token.name.substring(6));
      } else {
        let key = token.name;
        if (token.name.startsWith("locals")) {
          key = token.name.replace(".", "_");
        } else if (token.name.startsWith("globals.")) {
          key = token.name.replace(".", "_");
        }
        value = context.get(key);
      }
      if (value === null) {
        result.return = new JSON.Null();
      } else {
        result.return = value;
      }
    } else {
      result.return = code;
    }
    return result;
  }

  // If code is an inline array return it's evaluated values.
  if (code.isArr) {
    const arrayValue = (<JSON.Arr>code).valueOf();
    const elements = new JSON.Arr();
    for (let i: i32 = 0; i < arrayValue.length; i++) {
      const value = evaluateCode(arrayValue[i], context, store);
      if (value.return === null) {
        elements.push(new JSON.Null());
      } else {
        elements.push(<JSON.Value>value.return);
      }
    }
    result.return = elements;
    return result;
  }

  const virtualOperators = <JSON.Obj>code;
  const keys = virtualOperators.keys;
  if (keys.length === 0) {
    result.return = code;
    return result;
  }

  let _result: JSON.Value | null;
  let offsetIndex = 0;
  for (let i: i32 = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = virtualOperators.get(key);

    if (value === null) {
      continue;
    }
    let operands: JSON.Value[];
    if (value.isArr) {
      operands = (<JSON.Arr>value).valueOf();
    } else {
      result.status = EvaluationStatus.FAILED;
      result.message = `Invalid operands for operator ${key}`;
      return result;
    }

    if (key === "$object") {
      // Object escaping.
      // $object function will just return it's argument[0] as it is.
      _result = operands[0];
      continue;
    }
    let args: JSON.Value[];
    if (conditionalOperatorNames.includes(key)) {
      // We only need to evaluate operands on demand inside the conditional operator
      args = operands;
    } else {
      args = evaluateArguments(operands, context, store);
    }
    const evaluatedValue = evaluateFunction(key, args, context, store);
    // We have to exclude return value from store operator
    if (key === "$store") {
      offsetIndex += 1;
      continue;
    }
    // By default multiple call expressions will be combined with $and operator
    _result =
      i - offsetIndex === 0
        ? evaluatedValue
        : new JSON.Bool(result && evaluatedValue ? true : false);
    result.return = _result;
  }

  return result;
}

class Token {
  constructor(public name: string, public isIdentifier: boolean) {}
}

export function parseIdentifier(name: string): Token {
  if (name && name.startsWith("$")) {
    return new Token(name.substring(1), true);
  }
  return new Token(name, false);
}

function evaluateArguments(
  args: JSON.Value[],
  context: EvaluationContext,
  store: EvaluationStore
): JSON.Value[] {
  const results: JSON.Value[] = [];
  for (let i: i32 = 0; i < args.length; i++) {
    const arg = args[i];
    const result = evaluateCode(arg, context, store);
    results.push(result.return);
  }

  return results;
}

export function evaluateFunction(
  name: string,
  args: JSON.Value[],
  context: EvaluationContext,
  store: EvaluationStore
): JSON.Value {
  if (functions.has(name)) {
    const func = functions.get(name);
    return func(args, context, store);
  } else if (context.exists(name)) {
    const code = <Value>context.get(name);
    const result = evaluateCode(code, context, store);
    // log(`Virtual call -> ${name} : ${result.return.toString()}`);
    // if (result.return.isNull) {
    //   log(code.toString());
    // }
    return result.return;
  }
  throw new Error(`Function '${name}' is not defined`);
}
