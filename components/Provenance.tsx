export type ProvenanceValue =
  | { source: "model"; model: string }
  | { source: "rules"; reason: string };

/**
 * Says who wrote what you are reading.
 *
 * A member being told why their money stopped deserves to know whether that
 * explanation came from a fixed rule or from a language model, and models get
 * things wrong. This label is not decoration — it is the disclosure.
 */
export default function Provenance({ value }: { value: ProvenanceValue }) {
  const isModel = value.source === "model";

  return (
    <p
      className={`mt-3 flex flex-wrap items-baseline gap-x-2 rounded-sm border px-3 py-2 text-xs ${
        isModel
          ? "border-accent/30 bg-accent-soft text-ink"
          : "border-line bg-sunk text-ink-muted"
      }`}
    >
      <span className="font-semibold tracking-wide uppercase">
        {isModel ? "Written by a model" : "Written by a fixed rule"}
      </span>
      <span className="text-ink-muted">
        {isModel
          ? `${value.model}. Check anything it tells you against the portal before you act on it.`
          : value.reason}
      </span>
    </p>
  );
}
