import { useCallback, useEffect, useRef, useState } from 'react';
import { saveDraft } from '../lib/drafts';

export function useAutoSave(
  emailId: string | null,
  subject: string,
  blocks: unknown,
  onSaved: (id: string) => void
) {
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const id = await saveDraft(emailId, subject, blocks);
      onSaved(id);
      setSavedAt(new Date());
    } catch (e) {
      console.error('Auto-save failed:', e);
    } finally {
      setSaving(false);
    }
  }, [emailId, subject, blocks, onSaved]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 3000);
    return () => clearTimeout(timerRef.current);
  }, [save]);

  return { savedAt, saving };
}
