import { Toaster as Sonner } from "sonner@2.0.3"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <>
      <style>{`
        @keyframes micro-bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-4px) scale(1.02);
          }
          50% {
            transform: translateY(-2px) scale(1.01);
          }
          75% {
            transform: translateY(-1px) scale(1.005);
          }
        }
        
        [data-type="success"] {
          animation: micro-bounce 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <Sonner
        theme="light"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        {...props}
      />
    </>
  )
}

export { Toaster }
