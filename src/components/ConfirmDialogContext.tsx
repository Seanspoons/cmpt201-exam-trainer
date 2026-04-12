import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type ConfirmOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

type DialogState = ConfirmOptions & {
  open: boolean
}

type ConfirmDialogContextValue = {
  requestConfirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextValue>({
  requestConfirm: async () => false,
})

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  })
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

  const requestConfirm: ConfirmDialogContextValue['requestConfirm'] = (options) => {
    setDialog({
      open: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel ?? 'Confirm',
      cancelLabel: options.cancelLabel ?? 'Cancel',
    })
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve)
    })
  }

  const close = (result: boolean) => {
    if (resolver) resolver(result)
    setResolver(null)
    setDialog((prev) => ({ ...prev, open: false }))
  }

  const value = useMemo(
    () => ({
      requestConfirm,
    }),
    [],
  )

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      {dialog.open ? (
        <div
          className="confirm-dialog-backdrop"
          role="presentation"
          onClick={() => close(false)}
        >
          <div
            className="confirm-dialog-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="confirm-dialog-title">{dialog.title}</h3>
            <p>{dialog.message}</p>
            <div className="confirm-dialog-actions">
              <button className="button-secondary" onClick={() => close(false)}>
                {dialog.cancelLabel}
              </button>
              <button className="button-primary" onClick={() => close(true)}>
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmDialogContext.Provider>
  )
}

export function useConfirmDialog() {
  return useContext(ConfirmDialogContext)
}

