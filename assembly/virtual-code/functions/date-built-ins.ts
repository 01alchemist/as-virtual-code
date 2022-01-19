import { Date as WASI_Date } from "as-wasi";
import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { EvaluationContext, EvaluationStore, log } from "..";
import {
  jsonToBigInt,
  jsonToBoolean,
  jsonToInt32,
  jsonToNumber,
  jsonToString,
} from "./utils";

enum Unit {
  YEAR,
  QUARTER,
  MONTH,
  WEEK,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  INVALID = -1,
}

function timestamp(operands: Value[]): i64 {
  if (operands.length == 0) {
    return <i64>WASI_Date.now();
  }
  if (operands.length == 1) {
    if (operands[0].isString) {
      return Date.fromString(jsonToString(operands[0])).getTime();
    }
    return new Date(jsonToBigInt(operands[0])).getTime();
  }
  if (operands.length == 2) {
    const year = jsonToInt32(operands[0]);
    const month = jsonToInt32(operands[1]);
    const date = new Date(0);
    date.setUTCFullYear(year);
    date.setUTCMonth(month - 1);
    return date.getTime();
  }
  if (operands.length == 3) {
    const year = jsonToInt32(operands[0]);
    const month = jsonToInt32(operands[1]);
    const day = jsonToInt32(operands[2]);
    const date = new Date(0);
    date.setUTCFullYear(year);
    date.setUTCMonth(month);
    date.setUTCDate(day);
    //log(`Date time: ${date.getTime().toString()}`);
    return date.getTime();
  }
  if (operands.length == 4) {
    const year = jsonToInt32(operands[0]);
    const month = jsonToInt32(operands[1]);
    const day = jsonToInt32(operands[2]);
    const hours = jsonToInt32(operands[3]);
    const date = new Date(0);
    date.setUTCFullYear(year);
    date.setUTCMonth(month);
    date.setUTCDate(day);
    date.setUTCHours(hours);
    return date.getTime();
  }
  if (operands.length == 5) {
    const year = jsonToInt32(operands[0]);
    const month = jsonToInt32(operands[1]);
    const day = jsonToInt32(operands[2]);
    const hours = jsonToInt32(operands[3]);
    const minutes = jsonToInt32(operands[4]);
    const date = new Date(0);
    date.setUTCFullYear(year);
    date.setUTCMonth(month);
    date.setUTCDate(day);
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    return date.getTime();
  }
  if (operands.length == 6) {
    const year = jsonToInt32(operands[0]);
    const month = jsonToInt32(operands[1]);
    const day = jsonToInt32(operands[2]);
    const hours = jsonToInt32(operands[3]);
    const minutes = jsonToInt32(operands[4]);
    const seconds = jsonToInt32(operands[5]);
    const date = new Date(0);
    date.setUTCFullYear(year);
    date.setUTCMonth(month);
    date.setUTCDate(day);
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(seconds);
    return date.getTime();
  }

  const year = jsonToInt32(operands[0]);
  const month = jsonToInt32(operands[1]);
  const day = jsonToInt32(operands[2]);
  const hours = jsonToInt32(operands[3]);
  const minutes = jsonToInt32(operands[4]);
  const seconds = jsonToInt32(operands[5]);
  const milliseconds = jsonToInt32(operands[6]);
  const date = new Date(0);
  date.setUTCFullYear(year);
  date.setUTCMonth(month);
  date.setUTCDate(day);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(seconds);
  date.setUTCMilliseconds(milliseconds);
  return date.getTime();
}
function date(operands: Value[]): Date {
  if (operands.length == 0) {
    return new Date(<i64>WASI_Date.now());
  }
  if (operands[0].isString) {
    // log(`Date string: ${jsonToString(operands[0])}`);
    return Date.parse(jsonToString(operands[0]));
  }
  const ms = jsonToBigInt(operands[0]);
  // log(`Date time: ${ms.toString()}`);
  return new Date(ms);
}
function clone(date: Date): Date {
  return new Date(date.getTime());
}
/* function set(date: Date, unit: Unit, value: i64) {
  // private set
  const arg = unit === Unit.DAY ? _date(date) + (value - date.$W) : int;

  if (unit === C.M || unit === C.Y) {
    // clone is for badMutable plugin
    const date = this.clone().set(C.DATE, 1);
    date.$d[name](arg);
    date.init();
    this.$d = date.set(C.DATE, Math.min(date.$D, date.daysInMonth())).$d;
  } else if (name) date.$d[name](arg);
  return date;
} */
function date_add(date: Date, value: i64, unit: Unit): Date {
  switch (unit) {
    case Unit.YEAR: {
      const d2 = clone(date);
      const year: i32 = d2.getUTCFullYear() + <i32>value;
      // const _date = d2.getUTCDate();
      // d2.setUTCDate(1);
      d2.setUTCFullYear(year);
      // d2.setUTCDate(0);
      // const daysInMonth = d2.getUTCDate();
      // d2.setUTCDate(min(_date, daysInMonth));
      return d2;
    }
    case Unit.MONTH: {
      const d2 = clone(date);
      let month: i32 = d2.getUTCMonth() + <i32>value;
      const _date = d2.getUTCDate();
      d2.setUTCDate(1);
      if (month > 11 || month < 0) {
        let year: i32 = d2.getUTCFullYear();
        year += floor(month / 11);
        d2.setUTCFullYear(year);
        month %= 11;
        month = abs(month);
      }
      log(`setUTCMonth: ${month}`);
      d2.setUTCMonth(month);
      log(`getUTCMonth: ${d2.getUTCMonth()}`);
      d2.setUTCDate(0);
      const daysInMonth = d2.getUTCDate();
      d2.setUTCDate(min(_date, daysInMonth));
      return d2;
    }
    case Unit.DAY:
      return new Date(date.getTime() + value * MILLISECONDS_A_DAY);
    case Unit.HOUR:
      return new Date(date.getTime() + value * MILLISECONDS_A_HOUR);
    case Unit.MINUTE:
      return new Date(date.getTime() + value * MILLISECONDS_A_MINUTE);
    case Unit.SECOND:
      return new Date(date.getTime() + value * MILLISECONDS_A_SECOND);
    case Unit.MILLISECOND:
      return new Date(date.getTime() + value);
  }
  return new Date(date.getTime() + value);
}
function year<T>(timestamp: T): i64 {
  if (isInteger<T>()) {
    return new Date(changetype<i64>(timestamp)).getUTCFullYear();
  }
  return changetype<Date>(timestamp).getUTCFullYear();
}
function month<T>(timestamp: T): i64 {
  if (isInteger<T>()) {
    return new Date(changetype<i64>(timestamp)).getUTCMonth();
  }
  return changetype<Date>(timestamp).getUTCMonth();
}
function _date<T>(timestamp: T): i64 {
  if (isInteger<T>()) {
    return new Date(changetype<i64>(timestamp)).getUTCDate();
  }
  return changetype<Date>(timestamp).getUTCDate();
}
function weekday<T>(timestamp: T): i64 {
  if (isInteger<T>()) {
    return new Date(changetype<i64>(timestamp)).getUTCDay();
  }
  return changetype<Date>(timestamp).getUTCDay();
}
// [year, monthIndex, day, hours, minutes, seconds, milliseconds]
export const $date = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  return new JSON.Integer(timestamp(operands));
};
export const $date_date = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  return new JSON.Integer(_date(timestamp(operands)));
};
export const $date_day = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => new JSON.Integer(weekday(timestamp(operands)));

export const $date_month = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  return new JSON.Integer(month(timestamp(operands)) + 1);
};
export const $date_year = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  return new JSON.Integer(year(timestamp(operands)));
};

function stringToUnit(unit: string): Unit {
  if (unit == "year" || unit == "years") return Unit.YEAR;
  if (unit == "quarter" || unit == "quarters") return Unit.QUARTER;
  if (unit == "month" || unit == "months") return Unit.MONTH;
  if (unit == "week" || unit == "weeks") return Unit.WEEK;
  if (unit == "day" || unit == "days") return Unit.DAY;
  if (unit == "hour" || unit == "hours") return Unit.HOUR;
  if (unit == "minute" || unit == "minutes") return Unit.MINUTE;
  if (unit == "second" || unit == "seconds") return Unit.SECOND;
  if (unit == "millisecond" || unit == "milliseconds") return Unit.MILLISECOND;
  return Unit.INVALID;
}

function monthDiff_i64(a: Date, b: Date): i64 {
  const ams = a.getTime();
  const bms = b.getTime();
  if (ams < bms) return -monthDiff_i64(b, a);
  const wholeMonthDiff = (year(a) - year(b)) * 12 + (month(a) - month(b));
  return wholeMonthDiff;
}
function monthDiff_f64(a: Date, b: Date): f64 {
  const ams = a.getTime();
  const bms = b.getTime();
  if (ams < bms) return -monthDiff_f64(b, a);
  const wholeMonthDiff = (year(b) - year(a)) * 12 + (month(b) - month(a));
  const anchor = date_add(a, wholeMonthDiff, Unit.MONTH).getTime();
  const isNegative = bms - anchor < 0;
  const adjust = isNegative ? -1 : 1;
  const anchor2 = date_add(a, wholeMonthDiff + adjust, Unit.MONTH).getTime();
  const divider: f64 = f64(isNegative ? anchor - anchor2 : anchor2 - anchor);
  log(`adjust: ${adjust}`);
  log(`anchor1: ${anchor}`);
  log(`anchor2: ${anchor2}`);
  log(`divider: ${divider}`);
  const fraction: f64 = divider == 0 ? 0 : f64(bms - anchor) / divider;
  log(`wholeMonthDiff: ${wholeMonthDiff}`);
  log(`fraction: ${fraction}`);
  return f64(-wholeMonthDiff) + fraction || 0;
}

// @ts-ignore
@inline
const MILLISECONDS_A_WEEK = 7 * 24 * 60 * 60 * 1000;
// @ts-ignore
@inline
const MILLISECONDS_A_DAY = 24 * 60 * 60 * 1000;
// @ts-ignore
@inline
const MILLISECONDS_A_HOUR = 60 * 60 * 1000;
// @ts-ignore
@inline
const MILLISECONDS_A_MINUTE = 60 * 1000;
// @ts-ignore
@inline
const MILLISECONDS_A_SECOND = 1000;

function diff_i64(diff: i64, date1: Date, date2: Date, unit: Unit): i64 {
  let result: i64 = 0;
  switch (unit) {
    case Unit.YEAR:
      result = monthDiff_i64(date1, date2) / 12;
      break;
    case Unit.QUARTER:
      result = monthDiff_i64(date1, date2) / 3;
      break;
    case Unit.MONTH:
      result = monthDiff_i64(date1, date2);
      break;
    case Unit.WEEK:
      result = diff / MILLISECONDS_A_WEEK;
      break;
    case Unit.DAY:
      result = diff / MILLISECONDS_A_DAY;
      break;
    case Unit.HOUR:
      result = diff / MILLISECONDS_A_HOUR;
      break;
    case Unit.MINUTE:
      result = diff / MILLISECONDS_A_MINUTE;
      break;
    case Unit.SECOND:
      result = diff / MILLISECONDS_A_SECOND;
      break;
    case Unit.MILLISECOND:
    case Unit.INVALID:
      result = diff;
      break;
  }
  return result;
}

function diff_f64(diff: i64, date1: Date, date2: Date, unit: Unit): f64 {
  let result: f64 = 0;
  switch (unit) {
    case Unit.YEAR:
      result = monthDiff_f64(date1, date2) / 12.0;
      break;
    case Unit.QUARTER:
      result = monthDiff_f64(date1, date2) / 3.0;
      break;
    case Unit.MONTH:
      result = monthDiff_f64(date1, date2);
      break;
    case Unit.WEEK:
      result = f64(<f64>diff / <f64>MILLISECONDS_A_WEEK);
      break;
    case Unit.DAY:
      result = f64(<f64>diff / <f64>MILLISECONDS_A_DAY);
      break;
    case Unit.HOUR:
      result = f64(<f64>diff / <f64>MILLISECONDS_A_HOUR);
      break;
    case Unit.MINUTE:
      result = f64(<f64>diff / <f64>MILLISECONDS_A_MINUTE);
      break;
    case Unit.SECOND:
      result = f64(<f64>diff / <f64>MILLISECONDS_A_SECOND);
      break;
    case Unit.MILLISECOND:
    case Unit.INVALID:
    default:
      result = f64(diff);
      break;
  }
  return result;
}

export const $date_diff = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  let date1: Date = date([operands[0]]);
  let date2: Date = date([operands[1]]);

  if (date1 != null && date2 != null) {
    const diff = date1.getTime() - date2.getTime();

    if (operands.length == 2) {
      return new JSON.Num(f64(diff));
    }
    if (operands[2].isString) {
      const unit: Unit = stringToUnit(jsonToString(operands[2]));
      let truncate: bool = false;
      if (operands.length > 3) {
        truncate = jsonToBoolean(operands[3]);
      }
      if (truncate) {
        return new JSON.Num(f64(diff_i64(diff, date1, date2, unit)));
      } else {
        return new JSON.Num(f64(diff_f64(diff, date1, date2, unit)));
      }
    } else {
      throw new Error(`Invalid unit '${operands[2].toString()}'`);
    }
  }
  return new JSON.Null();
};

export const $date_format = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const d: Date = date([operands[0]]);
  const format: string = jsonToString(operands[1]);
  if (format == "YYYY-MM-DD") {
    const str = `${year(d)}-${month(d) + 1}-${_date(d)}`;
    return new JSON.Str(str);
  }
  return new JSON.Str(`${_date(d)}-${month(d) + 1}-${year(d)}`);
};

export const $date_add = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const d: Date = date([operands[0]]);
  const duration: i64 = jsonToInt32(operands[1]);
  const unit: Unit = stringToUnit(jsonToString(operands[2]));
  const result = date_add(d, duration, unit);
  return new JSON.Integer(result.getTime());
};
