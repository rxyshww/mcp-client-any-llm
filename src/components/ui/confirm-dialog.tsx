'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg"
        )}>
          <div className="flex flex-col gap-2">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              {description}
            </Dialog.Description>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              删除
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
