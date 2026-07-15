import { useEffect } from 'react'

const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/**
 * useHotkey — binds a single-key shortcut (no modifiers) to a handler.
 * Automatically ignored while the user is typing in a form field, or
 * while any modal/overlay is open (a `data-modal-open` flag on <body>
 * would be one way to extend this — for now it simply respects focus).
 */
export function useHotkey(key, handler, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return

    function onKeyDown(e) {
      const target = e.target
      const isEditable = EDITABLE_TAGS.has(target?.tagName) || target?.isContentEditable
      if (isEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault()
        handler(e)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [key, handler, enabled])
}
