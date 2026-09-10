export function safeSerialize(value: unknown): unknown {
  const seen = new WeakSet<object>();

  return JSON.parse(JSON.stringify(value, (_key, current) => {
    if (typeof current === "object" && current !== null) {
      if (seen.has(current)) return "[Circular]";
      seen.add(current);
    }

    if (typeof current === "bigint") return current.toString();
    return current;
  }));
}
