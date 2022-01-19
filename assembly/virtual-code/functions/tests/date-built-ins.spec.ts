import { EvaluationContext, EvaluationStore } from "../..";
import { $subtract } from "../arithmetic-operators";
import { $date, $date_date, $date_diff, $date_month } from "../date-built-ins";
import { jsonToBigInt, jsonToNumber } from "../utils";
import { b, i, s } from "./utils";

const context = new EvaluationContext();
const store = new EvaluationStore();

describe("Date built-ins standalone test suite", () => {
  describe("$date tests", () => {
    describe("When passing no arguments", () => {
      it("Should return current date", () => {
        const now1 = Date.now();
        const result = $date([], context, store);
        const now2 = jsonToBigInt(result);
        const diff = now2 - now1;
        expect(now1).toBeGreaterThan(0);
        expect(now2).toBeGreaterThan(0);
        expect(diff).toBeLessThanOrEqual(5);
      });
    });

    describe("When passing first argument as date string", () => {
      it("Should return correct date in milliseconds", () => {
        const result = jsonToBigInt(
          $date([s("Mon Sep 02 2019 16:22:29")], context, store)
        );
        const time = Date.fromString("Mon Sep 02 2019 16:22:29").getTime();
        expect(result).toBe(time);
      });
    });

    describe("When passing multiple date argument", () => {
      it("Should return correct date", () => {
        const result = jsonToBigInt(
          $date([i(2019), i(0), i(12)], context, store)
        );
        expect(result).toBe(1547251200000);
      });
    });

    describe("When passing first argument as milliseconds time", () => {
      it("Should return correct date in milliseconds", () => {
        const result = jsonToBigInt($date([i(1567434150000)], context, store));
        expect(result).toBe(1567434150000);
      });
    });

    describe("When subtracting two milliseconds time dates", () => {
      it("Should return correct date difference in milliseconds", () => {
        const result = jsonToBigInt(
          $subtract(
            [
              $date([i(1567434150000)], context, store),
              $date([i(1567434149000)], context, store),
            ],
            context,
            store
          )
        );
        expect(result).toBe(1000);
      });
    });
  });

  describe("$date.diff tests", () => {
    describe("When diffing two dates", () => {
      it("Should return correct date difference in milliseconds", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
            ],
            context,
            store
          )
        );
        expect(result).toBe(59831046000);
      });
      it("Should return correct date difference in seconds", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
              s("seconds"),
              b(true),
            ],
            context,
            store
          )
        );
        expect(result).toBe(59831046);
      });
      it("Should return correct date difference in minutes", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:00.000")], context, store),
              $date([s("2017-10-10T02:38:00.000")], context, store),
              s("minutes"),
              b(true),
            ],
            context,
            store
          )
        );
        expect(result).toBe(997184);
      });
      it("Should return correct date difference in truncated minutes", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
              s("minutes"),
              b(true),
            ],
            context,
            store
          )
        );
        expect(result).toBe(997184);
      });
      it("Should return correct date difference in truncated hours", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
              s("hours"),
              b(true),
            ],
            context,
            store
          )
        );
        expect(result).toBe(16619);
      });
      it("Should return correct date difference in hours", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
              s("hours"),
              b(false),
            ],
            context,
            store
          )
        );
        expect(result).toBeCloseTo(16619.735);
      });
      it("Should return correct date difference in weeks", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
              s("weeks"),
              b(true),
            ],
            context,
            store
          )
        );
        expect(result).toBe(98);
      });
      it("Should return correct date difference in non-truncated weeks", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
              s("weeks"),
              b(false),
            ],
            context,
            store
          )
        );
        expect(result).toBeCloseTo(98.92699404761905);
      });
      it("Should return correct date difference in truncated months", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-02-02T14:22:30.000")], context, store),
              $date([s("2019-01-01T02:38:24.000")], context, store),
              s("months"),
              b(true),
            ],
            context,
            store
          )
        );
        expect(result).toBe(1);
      });
      it("Should return correct date difference in non-truncated months", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-02-20T14:22:30.000")], context, store),
              $date([s("2019-01-01T02:38:24.000")], context, store),
              s("months"),
              b(false),
            ],
            context,
            store
          )
        );
        expect(result).toBeCloseTo(1.5);
      });
      it("Should return correct date difference in truncated years", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
              s("years"),
              b(true),
            ],
            context,
            store
          )
        );
        expect(result).toBe(1);
      });
      it("Should return correct date difference in non-truncated years", () => {
        const result = jsonToNumber(
          $date_diff(
            [
              $date([s("2019-09-02T14:22:30.000")], context, store),
              $date([s("2017-10-10T02:38:24.000")], context, store),
              s("years"),
              b(false),
            ],
            context,
            store
          )
        );
        expect(result).toBeCloseTo(1.8965027964205816);
      });
    });
  });

  describe("$date.day tests", () => {
    describe("When passing a date", () => {
      it("Should return correct date 01", () => {
        const result = jsonToNumber(
          $date_date(
            [$date([s("Mon Sep 01 2019 16:22:30")], context, store)],
            context,
            store
          )
        );
        expect(result).toBe(1);
      });
      it("Should return correct date 02", () => {
        const result = jsonToNumber(
          $date_date(
            [$date([s("2019-09-02T14:22:30.000")], context, store)],
            context,
            store
          )
        );
        expect(result).toBe(2);
      });
      it("Should return correct date 17", () => {
        const result = jsonToNumber(
          $date_date(
            [$date([s("2019-09-17T14:22:30.000")], context, store)],
            context,
            store
          )
        );

        expect(result).toBe(17);
      });
      it("Should return correct date 28", () => {
        const result = jsonToNumber(
          $date_date(
            [$date([s("2019-09-28T14:22:30.000")], context, store)],
            context,
            store
          )
        );
        expect(result).toBe(28);
      });
    });
  });

  describe("$date.month tests", () => {
    describe("When passing a date", () => {
      it("Should return correct month 01", () => {
        const result = jsonToNumber(
          $date_month(
            [$date([s("2019-01-01T15:22:30.000")], context, store)],
            context,
            store
          )
        );
        expect(result).toBe(1);
      });
      it("Should return correct month 02", () => {
        const result = jsonToNumber(
          $date_month(
            [$date([s("2019-02-02T15:22:30.000")], context, store)],
            context,
            store
          )
        );
        expect(result).toBe(2);
      });
      it("Should return correct month 06", () => {
        const result = jsonToNumber(
          $date_month(
            [$date([s("2019-06-02T14:22:30.000")], context, store)],
            context,
            store
          )
        );
        expect(result).toBe(6);
      });
      it("Should return correct month 12", () => {
        const result = jsonToNumber(
          $date_month(
            [$date([s("2019-12-17T15:22:30.000")], context, store)],
            context,
            store
          )
        );
        expect(result).toBe(12);
      });
    });
  });
});
