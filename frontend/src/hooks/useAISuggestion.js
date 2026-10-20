import { useEffect, useRef, useState } from "react";

// A request belongs to the field that started it. Leaving that field cancels it.
export default function useAISuggestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  const run = async (generate) => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true); setError("");
    try {
      const result = await generate(request.signal);
      if (!request.signal.aborted) setSuggestion(result);
    } catch (e) {
      if (!request.signal.aborted) setError(e.message || "Could not generate a suggestion. Try again.");
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  };
  return { loading, error, setError, suggestion, setSuggestion, run };
}
