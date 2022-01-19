import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";
import { $add, $divide, $multiply, $subtract } from "./arithmetic-operators";
import { $in, $nin, $sort } from "./array-built-ins";
import { $eq, $ne, $gt, $gte, $lt, $lte } from "./comparison-operators";
import { $evaluateIf, $select, $selectIf } from "./conditional-operators";
import {
  $date,
  $date_add,
  $date_date,
  $date_day,
  $date_diff,
  $date_format,
  $date_month,
  $date_year,
} from "./date-built-ins";
import { $and, $not, $or } from "./logical-operators";
import { $abs, $isNaN, $max, $min, $round } from "./math-built-ins";
import { $exists, $keys } from "./object-built-ins";
import { $reject } from "./special-calc-functions";
import { $store } from "./store-operators";
import { $toDouble, $toInt } from "./type-conversion-built-ins";

type FunctionType = (
  operands: Value[],
  context?: EvaluationContext,
  store?: EvaluationStore
) => Value;

export const functions: Map<string, FunctionType> = new Map();
//arithmetic-operators
functions.set("$add", $add);
functions.set("$subtract", $subtract);
functions.set("$multiply", $multiply);
functions.set("$divide", $divide);

//comparison-operators
functions.set("$eq", $eq);
functions.set("$ne", $ne);
functions.set("$gt", $gt);
functions.set("$lt", $lt);
functions.set("$gte", $gte);
functions.set("$lte", $lte);

//logical-operators
functions.set("$and", $and);
functions.set("$or", $or);
functions.set("$not", $not);

//conditional-operators
export const conditionalOperatorNames = [
  "$selectDefined",
  "$select",
  "$selectIf",
  "$evaluateIf",
];
functions.set("$select", $select);
functions.set("$selectIf", $selectIf);
functions.set("$evaluateIf", $evaluateIf);

//type-conversion-built-ins
functions.set("$toDouble", $toDouble);
functions.set("$toInt", $toInt);

//array-built-ins
functions.set("$in", $in);
functions.set("$nin", $nin);
functions.set("$sort", $sort);

//math-built-ins
functions.set("$abs", $abs);
functions.set("$isNaN", $isNaN);
functions.set("$min", $min);
functions.set("$max", $max);
functions.set("$round", $round);

//object-built-ins
functions.set("$exists", $exists);
functions.set("$keys", $keys);

//date-built-ins
functions.set("$date", $date);
functions.set("$date.day", $date_day);
functions.set("$date.date", $date_date);
functions.set("$date.month", $date_month);
functions.set("$date.year", $date_year);
functions.set("$date.diff", $date_diff);
functions.set("$date.format", $date_format);
functions.set("$date.add", $date_add);

//store-operators
functions.set("$store", $store);

//special-calc-functions
functions.set("$reject", $reject);
