export default function errorsParseHelper(data: {[key: string | number | symbol]: string[]}) {
  const messages: string[] = [];

  Object.keys(data).forEach((key: string) => {
    const parsedKey = parseValue(key);
    const elementsString = data[key].map((element: string) => parseValue(element)).join(', ')

    messages.push(`${parsedKey}: ${elementsString}`);
  });

  return messages;
}

function parseValue(key: string) {
  return key.replaceAll("_", " ")
}
