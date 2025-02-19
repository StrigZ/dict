'use client';

import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer';

import NewArticleForm from './NewArticleForm';

export function NewArticleDrawerDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowSize();
  const isDesktop = width > 768;

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="absolute bottom-6 right-6">
            New <SquarePen />
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>New Article</DialogTitle>
          </DialogHeader>
          <NewArticleForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="absolute bottom-6 right-6">
          New <SquarePen />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Article</DrawerTitle>
        </DrawerHeader>
        <NewArticleForm className="px-4" onClose={() => setIsOpen(false)} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
