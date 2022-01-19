# Virtual Code v1 Specification

Virtual Code is a safe and portable format to represent dynamic branching in calculation and element visibility in forms.

## Syntax

Detailed Syntax Specification can be found here [Syntax Spec](./syntax.md)

**Example**

```js
code = {
  $or: [
    {
      $and: [
        {
          $eq: ["$document.type", "html"]
        },
        {
          $eq: ["$document.version", 2]
        },
        {
          $gt: [
            { $date:["$document.createdAt"] },
            { $date:["2022-01-01"] },
          ]
        },
      ],
    },
    {
      $eq: ["$document.latest", true],
    },
  ];
}
// returns true
evaluate(code, {
  document: {
    type: "html",
    version: 2,
    createdAt: "2020-01-11",
    latest: true,
  },
});
```
