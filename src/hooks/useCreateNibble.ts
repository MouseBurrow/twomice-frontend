import { useRef, useState } from "react";
import { api } from "../api";
import type { ApiError } from "../apiError";

type Options = {
  board: string;
  onSuccess: () => void;
  contentRequired?: boolean;
};

export function useCreateNibble({ board, onSuccess, contentRequired = false }: Options) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError>();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const canSubmit = title.trim() !== "" && (!contentRequired || content.trim() !== "");

  async function submit(): Promise<boolean> {
    if (!canSubmit || loading) return false;
    setError(undefined);
    setLoading(true);
    try {
      await api.createPost(board, { title: title.trim(), content: content.trim(), tags: tags.length > 0 ? tags : undefined });
      onSuccessRef.current();
      return true;
    } catch (e) {
      setError(e as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTitle("");
    setContent("");
    setTags([]);
    setError(undefined);
  }

  return { title, setTitle, content, setContent, tags, setTags, loading, error, canSubmit, submit, reset };
}
