import {
  boldText,
  italicText,
  underlineText,
  hyperlinkText,
  emailToText,
  headerText,
} from "../../Scripts/text.js";
describe("Text functions", () => {
  describe("test suite: boldText", () => {
    it("should return the text with the bolded part", () => {
      const text = "Hello me";
      const start = 0;
      const end = 5;
      const boldedPart = boldText(text, start, end);
      expect(boldedPart).toBe(
        `<span class="bolded">${text.substring(0, 5)}</span>${text.substring(
          end,
          text.length
        )}`
      );
    });
    it("should return whole text bolded if start and end are not specified", () => {
      const text = "Hello world";
      const boldedPart = boldText(text);
      expect(boldedPart).toBe(`<span class="bolded">${text}</span>`);
    });
    it("should return text going from param 'start to text length if param 'end' is not specified", () => {
      const text = "Hello world";
      const start = 3;
      const boldedPart = boldText(text, start);
      expect(boldedPart).toBe(
        `${text.substring(0, start)}<span class="bolded">${text.substring(
          start,
          text.length
        )}</span>`
      );
    });
    it("should handle new lines", () => {
      const text = "Hello\nworld";
      const start = 0;
      const end = 7;
      const boldedPart = boldText(text, start, end);
      expect(boldedPart).toBe(
        `<span class="bolded">${text.substring(
          start,
          end
        )}</span>${text.substring(end, text.length)}`
      );
    });
  });
  describe("test suite: italicText", () => {
    it("should return the text with the italicized part", () => {
      const text = "Hello me!";
      const start = 0;
      const end = 5;
      const italicizedPart = italicText(text, start, end);
      expect(italicizedPart).toBe(
        `<span class="italicized">${text.substring(
          start,
          end
        )}</span>${text.substring(end, text.length)}`
      );
    });
    it("should return whole text italicized if start and end are not specified", () => {
      const text = "Hello code...";
      const italicizedPart = italicText(text);
      expect(italicizedPart).toBe(`<span class="italicized">${text}</span>`);
    });
    it("should return text going from param 'start' to text length if param 'end' is not specified", () => {
      const text = "Hello world";
      const start = 3;
      const italicizedPart = italicText(text, start);
      expect(italicizedPart).toBe(
        `${text.substring(0, start)}<span class="italicized">${text.substring(
          start,
          text.length
        )}</span>`
      );
    });
  });
  describe("test suite: underlineText", () => {
    it("should return the text with the underlined part", () => {
      const text = "Hello Coder!";
      const start = 0;
      const end = 5;
      const underlinedPart = underlineText(text, start, end);
      expect(underlinedPart).toBe(
        `<span class="underlined">${text.substring(
          start,
          end
        )}</span>${text.substring(end, text.length)}`
      );
    });
    it("should return whole text underlined if start and end are not specified", () => {
      const text = "Hello code...";
      const underlinedPart = underlineText(text);
      expect(underlinedPart).toBe(`<span class="underlined">${text}</span>`);
    });
    it("should return text going from param 'start' to text length if param 'end' is not specified", () => {
      const text = "Hello world";
      const start = 3;
      const underlinedPart = underlineText(text, start);
      expect(underlinedPart).toBe(
        `${text.substring(0, start)}<span class="underlined">${text.substring(
          start,
          text.length
        )}</span>`
      );
    });
    it("should handle new lines", () => {
      const text = "Hello\nworld";
      const start = 0;
      const end = 7;
      const underlinedPart = underlineText(text, start, end);
      expect(underlinedPart).toBe(
        `<span class="underlined">${text.substring(
          start,
          end
        )}</span>${text.substring(end, text.length)}`
      );
    });
    it("should handle new lines in the middle of the text", () => {
      const text = "Hello\nworld";
      const start = 3;
      const end = 7;
      const underlinedPart = underlineText(text, start, end);
      expect(underlinedPart).toBe(
        `${text.substring(0, start)}<span class="underlined">${text.substring(
          start,
          end
        )}</span>${text.substring(end, text.length)}`
      );
    });
    it("should return underlined text in the middle of the text", () => {
      const text = "Hello world";
      const start = 3;
      const end = 6;
      const underlinedPart = underlineText(text, start, end);
      expect(underlinedPart).toBe(
        `${text.substring(0, start)}<span class="underlined">${text.substring(
          start,
          end
        )}</span>${text.substring(end, text.length)}`
      );
    });
  });
  describe("test suite: hyperlinkText", function () {
    it("should hyperlink the entire text when start and end are default", function () {
      expect(
        hyperlinkText("Click here", undefined, undefined, "http://example.com")
      ).toBe('<a href="http://example.com" target="_blank">Click here</a>');
    });

    it("should hyperlink part of the text when start and end are provided", function () {
      expect(hyperlinkText("Click here", 6, 10, "http://example.com")).toBe(
        'Click <a href="http://example.com" target="_blank">here</a>'
      );
    });

    it('should hyperlink without target="_blank" when newTab is false', function () {
      expect(
        hyperlinkText("Click here", 6, 10, "http://example.com", false)
      ).toBe('Click <a href="http://example.com" >here</a>'); // I dont know why there is a space before ">"
    });

    it("should return original text when url is not provided", function () {
      expect(hyperlinkText("Click here")).toBe(
        `<a href="URL" target="_blank">Click here</a>`
      );
    });

    // Add more tests as needed to cover edge cases and error handling
  });
});
