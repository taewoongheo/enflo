function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function generateMainSuggestion(
  entropy: number,
  t: (key: string, options?: { returnObjects: boolean }) => string[] | string,
): string {
  let entropyLevel: string;

  if (entropy > 80) {
    entropyLevel = 'veryHigh';
  } else if (entropy > 60) {
    entropyLevel = 'high';
  } else if (entropy > 40) {
    entropyLevel = 'medium';
  } else if (entropy > 20) {
    entropyLevel = 'low';
  } else {
    entropyLevel = 'veryLow';
  }

  const entropyStateMessages = t(
    `mainSuggestion:entropyStateMessages.${entropyLevel}`,
    { returnObjects: true },
  ) as string[];
  const suggestionMessages = t(
    `mainSuggestion:suggestionMessages.${entropyLevel}`,
    { returnObjects: true },
  ) as string[];

  const stateMessage = getRandomMessage(entropyStateMessages);
  const suggestionMessage = getRandomMessage(suggestionMessages);

  return `${stateMessage} ${suggestionMessage}`;
}
