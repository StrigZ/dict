'use client';

import { type Article } from '@prisma/client';
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type BreadcrumbsContext = {
  activeArticle: Article | null;
  activeLetter: string | null;
  selectActiveArticle: (article: Article) => void;
  selectActiveLetter: (letter: string) => void;
  resetSelection: () => void;
};

const breadcrumbsContext = createContext<BreadcrumbsContext>({
  activeArticle: null,
  activeLetter: null,
  selectActiveArticle: () => {
    // do nothing
  },
  selectActiveLetter: () => {
    // do nothing
  },
  resetSelection: () => {
    // do nothing
  },
});

export const useBreadcrumbsContext = () => useContext(breadcrumbsContext);

export default function BreadcrumbsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeArticle, setActiveArticle] =
    useState<BreadcrumbsContext['activeArticle']>(null);
  const [activeLetter, setActiveLetter] =
    useState<BreadcrumbsContext['activeLetter']>(null);

  const selectActiveArticle: BreadcrumbsContext['selectActiveArticle'] =
    useCallback((article) => {
      setActiveArticle(article);
    }, []);

  const selectActiveLetter: BreadcrumbsContext['selectActiveLetter'] =
    useCallback((letter) => {
      setActiveLetter(letter);
    }, []);

  const resetSelection: BreadcrumbsContext['resetSelection'] =
    useCallback(() => {
      setActiveArticle(null);
      setActiveLetter(null);
    }, []);

  const value: BreadcrumbsContext = useMemo(
    () => ({
      activeArticle,
      selectActiveArticle,
      activeLetter,
      selectActiveLetter,
      resetSelection,
    }),
    [
      activeArticle,
      selectActiveArticle,
      activeLetter,
      selectActiveLetter,
      resetSelection,
    ],
  );
  return (
    <breadcrumbsContext.Provider value={value}>
      {children}
    </breadcrumbsContext.Provider>
  );
}
