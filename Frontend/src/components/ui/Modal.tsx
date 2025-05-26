import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;

const ModalContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>( ( { className, children, ...props }, ref ) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
            className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
        />
        <DialogPrimitive.Content
            ref={ ref }
            className={ cn(
                "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg rounded-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform will-change-opacity",
                "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
                "data-[state=open]:scale-100 data-[state=closed]:scale-95",
                "data-[state=open]:translate-y-[-50%] data-[state=closed]:translate-y-[-48%]",
                className
            ) }
            { ...props }
        >
            { children }
            <DialogPrimitive.Close className="absolute right-4 top-4 text-gray-500 hover:text-black">
                <X className="h-5 w-5" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>

    </DialogPrimitive.Portal>
) );
ModalContent.displayName = "ModalContent";

export { Modal, ModalTrigger, ModalContent };
