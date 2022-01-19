# VirtualCode Syntax Specification

`Version alpha-0.0.1`

## Grammar

```typescript
VirtualCode       = { ...CallExpression } | Literal;
CallExpression    = { $Identifier: [...ArgumentType] }
Identifier        = String
ArgumentType      = MemberExpression | "$Identifier" | CallExpression | Literal
MemberExpression  = "$Identifier.Identifier"
Literal           = Array<Literal> | String | Number | Boolean
```

## Expressions

### Property accessor expression

Strings starting with `$` symbol are identifiers

```js
"$Identifier";
```

Value of an identifier can be a Literal or a Function from context, operators or built-ins.

### Member expression

```js
"$Identifier.Identifier";
```

### Call expression

```ts
type CallExpression = {
  $Identifier: ArgumentType[];
};
```

**Syntax**

```ts
{
  $Identifier: [arg1[, arg2[, ...argN]],]
}
```

Call expression object can only contain one identifier since each node can only return one result.

## Operators

### Conditional operator

#### `$select`

Select first defined and non-null expression value. It is similar to `$or` but it will return the value only if the expression doesn't resolve to `undefined`❗️ and `null`. If an expression returns `undefined`❗️ or `null`, it will look for the next operand. If all of the expressions resolve to `undefined` or `null` it will return `null`. If an expression returns `false`, `0`, `NaN` or `""`, `$select` it will return that value.

⚠️ ❗️ `undefined` and `null` are considered as `null` in AssemblyScript

```js
{
  $select: [
    <Expression>,
    <Expression>,
    ...
  ]
}
```

#### `$selectIf`

Select the first value if the given condition returns true.
A special variable `$this` will be ejected to the context, which will hold the resolved value of the current element.

```js
{
  $selectIf: [
    <Expression>,
    <Expression>,
    ...,
    <ConditionExpression>
  ]
}
```

#### `$evaluateIf`

This operator accepts an array of `Expression` `Condition` pair and return  
the first evaluated expression if the respective condition returns true.

```js
{
  $evaluateIf: [
    Array<<Expression>, <ConditionExpression>>
  ]
}
```

### Logical operators

#### `$and`

```js
{
  $and:[
    <Expression>,
    <Expression>,
    ...
  ]
}
```

#### `$or`

```js
{
  $or:[
    <Expression>,
    <Expression>,
    ...
  ]
}
```

#### `$not`

```js
{
  $not:[
    <Expression>
  ]
}
```

### Comparison operators

#### `$eq`

Compares two values and returns:

`true` when the values are equivalent.
`false` when the values are not equivalent.

```js
{
  $eq:[
    <Expression>,
    <Expression>,
    <Strict:boolean>
  ]
}
```

`<Strict:boolean>` can have one of the following values:

- true (default) : strict equality same as ECMAScript
- false : non-strict equality same as ECMAScript plus object similarity matching

#### `$ne`

Opposite of `$eq` operator. This is equivalent to using [`$not`](#not) and [`$eq`](#eq) together.

```js
{
  $ne:[
    <Expression>,
    <Expression>,
    <Strict:boolean>
  ]
}
```

`<Strict:boolean>` can have one of the following values:

- true (default) : strict equality same as ECMAScript
- false : non-strict equality same as ECMAScript plus object similarity matching

#### `$gt`

Returns `true` if the left operand is greater than the right operand.

```js
{
  $gt:[
    <Expression>,
    <Expression>
  ]
}
```

#### `$gte`

Returns `true` if the left operand is greater than or equal to the right operand.

```js
{
  $gte:[
    <Expression>,
    <Expression>
  ]
}
```

#### `$lt`

Returns `true` if the left operand is less than the right operand.

```js
{
  $lt:[
    <Expression>,
    <Expression>
  ]
}
```

#### `$lte`

Returns `true` if the left operand is less than or equal to the right operand.

```js
{
  $lte:[
    <Expression>,
    <Expression>
  ]
}
```

### Arithmetic operators

#### `$subtract`

```js
{
  $subtract:[
    <Expression>,
    <Expression>
  ]
}
```

#### `$add`

```js
{
  $add:[
    <Expression>,
    <Expression>
  ]
}
```

#### `$divide`

```js
{
  $divide:[
    <Expression>,
    <Expression>
  ]
}
```

#### `$multiply`

```js
{
  $multiply:[
    <Expression>,
    <Expression>
  ]
}
```

## Built-ins

### Math

#### `$abs`

This function returns the absolute value of a number

```js
{
  $abs:[
    <Expression>
  ]
}
```

#### `$min`

This function returns the min value from an array of numbers

```js
{
  $min:[
    ...<Expression>
  ]
}
```

#### `$max`

This function returns the max value from an array of numbers

```js
{
  $max:[
    ...<Expression>
  ]
}
```

#### `$isNaN`

This function returns true if the argument is NaN

```js
{
  $isNaN:[
    <Expression>
  ]
}
```

### Object

#### `$object`

`$object` built-in will return the argument object without evaluation. This is useful for passing default object values to operators

```js
{
  $selectDefined: [
    "$questions.some_object_property",
    {
      $object: [{ prop1: "Value", prop2: 123 }],
    },
  ];
}
```

#### `$exists`

When `<boolean>` is true (default), `$exists` checks if `<Identifier>` exists in the context, including identifiers where the value is null. If `<boolean>` is false, it will invert the result. Default value of the second argument is `true`

```js
{
  $exists:[
    <Identifier>,
    <boolean>
  ]
}
```

#### `$keys`

Returns keys of an object. Same as `Object.keys` in JavaScript.

```js
{
  $keys:[
    <Expression>
  ]
}
```

### Array

#### `$in`

Returns a boolean indicating whether all the specified values are in an array.

```js
{
  $in:[
    <Expression>,
    <ArrayExpression>
  ]
}
```

#### `$nin`

Inverted result of [`$in`](#in)

```js
{
  $nin:[
    <Expression>,
    <ArrayExpression>
  ]
}
```

#### `$sort`

This function sorts the elements of an array and returns a new sorted array.
The default sort order is built upon converting the elements into strings, then comparing their sequences of UTF-16 code units values.

```js
{
  $sort:[<ArrayExpression>, <SortOrder:number>, <ElementType:string>]
}
```

`<SortOrder:number>` can have one of the following values:

- 0 (default) to specify default order.
- 1 to specify ascending order. Using `(a, b) => (a > b ? 1 : a === b ? 0 : -1)`
- -1 to specify descending order. Using `(a, b) => a > b ? -1 : a === b ? 0 : 1)`

`<ElementType:string>` can have one of the following values:

- any (default) - Use source array as it is.
- i32 - Convert elements to Int32Array and sort then return the original sorted elements
- u32 - Convert elements to Uint32Array and sort then return the original sorted elements
- f32 - Convert elements to Float32Array and sort then return the original sorted elements
- f64 - Convert elements to Float64Array and sort then return the original sorted elements

Specifying element type will not change the original elements instead create a new reference `TypedArray` for sorting then reorder the result array.

### Date

#### `$date`

Behavior is the same as [JavaScript Date Contructor]

```js
{
  $date: [string | number];
}
```

#### `$date.diff`

This function will accurately calculate the difference between two dates in years, months, weeks, days, hours, minutes, seconds and milliseconds.

```js
{
  $date.diff:["$date1", "$date2", <Measurement:string>, <Truncate:boolean>]
}
```

`<Measurement:string>` :

- year, month, week, day, hour, minute, second, millisecond (default)

`<Truncate:boolean>` :

- true : Truncate the result to zero decimal places
- false (default): Will not truncate and return floating-point number

#### `$date.date`

This function will return 1 based day

```js
{
  $date.day: [ { $date:["2019-09-06T05:53:21.922Z"] } ]
}
```

The above code will return `6`

#### `$date.month`

This function will return 1 based month

```js
{
  $date.month: [ { $date:["2019-09-06T05:53:21.922Z"] } ]
}
```

The above code will return `9`

### Type conversion

#### `$toDouble`

Convert string to 64-bit float

```js
{
  $toDouble: [string];
}
```

#### `$toInt`

Convert string to 32 bit integer

```js
{
  $toInt: [string];
}
```

### Store Value

#### `$store`

Store intermediate value to `store` object which can be accessed using `$store.<Identifier>` identifier

```js
// Write a value to the store
{
  $store: [string, any];
}

// Access a value from the store
("$store.<Identifier>");
```

Example

```js
// Write operation
{
  $store: ["someValueName", 100];
}

// Read operation
{
  $add: ["$store.someValueName", 50];
}
// Returns => 150
```

[mongodb $eq (aggregation)]: https://docs.mongodb.com/manual/reference/operator/aggregation/eq/index.html
[javascript date contructor]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Syntax
