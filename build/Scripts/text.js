function boldText(text, start = 0, end = text.length) {
  // Extract the part of the text that needs to be bolded
  const boldedPart = bolded(text.substring(start, end));

  // Return the text with the bolded part
  return `${text.slice(0, start)}${boldedPart}${text.slice(end)}`;
}
function italicText(text, start = 0, end = text.length) {
  // Extract the part of the text that needs to be italicized
  const italicizedPart = italicized(text.substring(start, end));

  // Return the text with the italicized part
  return `${text.slice(0, start)}${italicizedPart}${text.slice(end)}`;
}
function underlineText(text, start = 0, end = text.length) {
  // Extract the part of the text that needs to be underlined
  const underlinedPart = underlined(text.substring(start, end));

  // Return the text with the underlined part
  return `${text.slice(0, start)}${underlinedPart}${text.slice(end)}`;
}
function hyperlinkText(text, start = 0, end = text.length, url, newTab = true) {
  // Extract the part of the text that needs to be hyperlinked
  const hyperlinkedPart = hyperlink(text.substring(start, end), url, newTab);

  // Return the text with the hyperlinked part
  return `${text.slice(0, start)}${hyperlinkedPart}${text.slice(end)}`;
}
function emailToText(text, start = 0, end = text.length, email) {
  // Extract the part of the text that needs to be emailed
  const emailedPart = emailTo(text.substring(start, end), email);

  // Return the text with the emailed part
  return `${text.slice(0, start)}${emailedPart}${text.slice(end)}`;
}
function headerText(text, start = 0, end = text.length, level) {
  // Extract the part of the text that needs to be a header
  const headerPart = header(text.substring(start, end), level);

  // Return the text with the header part
  return `${text.slice(0, start)}${headerPart}${text.slice(end)}`;
}
function bolded(text) {
  return `<span class="bolded">${text}</span>`;
}
function italicized(text) {
  return `<span class="italicized">${text}</span>`;
}
function underlined(text) {
  return `<span class="underlined">${text}</span>`;
}
function hyperlink(text, url = "URL", newTab = true) {
  return `<a href="${url}" ${newTab ? 'target="_blank"' : ""}>${text}</a>`;
}
function emailTo(text, email) {
  return `<a href="mailto:${email}">${text}</a>`;
}
function header(text, level) {
  if (level < 1 || level > 6) {
    throw new Error("Invalid header level.");
  }
  return `<h${level}>${text}</h${level}>`;
}

export {
  boldText,
  italicText,
  underlineText,
  hyperlinkText,
  emailToText,
  headerText,
};
