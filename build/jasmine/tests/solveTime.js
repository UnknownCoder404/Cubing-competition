import {
  getAverage,
  getAverageNoFormat,
  formatTime,
  formatInputToSeconds,
} from "../../Scripts/solveTime.js";
describe("test suite: getAverage", () => {
  it("should return the average of the numbers in seconds", () => {
    const numbers = [1, 2, 3, 4, 5];
    const average = getAverage(numbers);
    expect(average).toBe("03.00");
  });
  it("should return the average of the numbers in minutes", () => {
    const numbers = [60, 60, 61, 59, 60];
    const average = getAverage(numbers);
    expect(average).toBe("1:00.00");
  });
  it("should return DNF", () => {
    const numbers = [0, 51, 31, 34, 0];
    const average = getAverage(numbers);
    expect(average).toBe("DNF");
  });
  it("should return 5 solves required", () => {
    const numbers = [14.53, 13.43, 31.45, 53];
    const average = getAverage(numbers);
    expect(average).toBe("Potrebno 5 slaganja");
  });
});
describe("test suite: getAverageNoFormat", () => {
  it("should return the average of the numbers in seconds", () => {
    const numbers = [1, 2, 3, 4, 5];
    const average = getAverageNoFormat(numbers);
    expect(average).toBe("3.00");
  });
  it("should return the average of the numbers in seconds (decimal)", () => {
    const numbers = [1.5, 2.2, 3.3, 4, 5.1];
    const average = getAverageNoFormat(numbers);
    expect(average).toBe("3.17");
  });
  it("should return the average of the numbers in minutes", () => {
    const numbers = [70, 65, 64, 66, 60];
    const average = getAverageNoFormat(numbers);
    expect(average).toBe("65.00");
  });
  it("should return the average of the numbers in minutes (decimal)", () => {
    const numbers = [60, 65.15, 63.46, 103.41, 334.1];
    const average = getAverageNoFormat(numbers);
    expect(average).toBe("77.34");
  });
});
describe("test suite: formatTime", () => {
  it("Formats decimal seconds to minutes", () => {
    const time = formatTime(77.34);
    expect(time).toBe("1:17.34");
  });
  it("Formats seconds to minutes", () => {
    const time = formatTime(60);
    expect(time).toBe("1:00.00");
  });
});
describe("test suite: formatInputToSeconds", () => {
  it("Formats 2 number", () => {
    const time = formatInputToSeconds("64");
    expect(time).toBe(0.64);
  });
  it("Formats 3 numbers", () => {
    const time = formatInputToSeconds("464");
    expect(time).toBe(4.64);
  });
  it("Formats 4 numbers", () => {
    const time = formatInputToSeconds("4640");
    expect(time).toBe(46.4);
  });
  it("Formats 5 numbers", () => {
    const time = formatInputToSeconds("43440");
    expect(time).toBe(4 * 60 + 34 + 0.4); // 4 minutes + 34s + 0.4s
  });
  it("Formats 6 numbers", () => {
    const time = formatInputToSeconds("443145");
    expect(time).toBe(44 * 60 + 31 + 0.45); // 44 minutes + 31s + 0.45s
  });
  it("Formats 4 decimal places using rounding down", () => {
    const time = formatInputToSeconds("5.5314341");
    expect(time).toBe(5.53);
  });
  it("Formats 4 decimal places using rounding up", () => {
    const time = formatInputToSeconds("34.1354341");
    expect(time).toBe(34.14);
  });
});
