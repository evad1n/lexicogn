import React, { createContext, useContext, useRef } from "react";

interface SearchInputState {
    focus: () => void;
    blur: () => void;
    inputRef: any;
}

// const searchContext = createContext<SearchInputState>(undefined!);
const searchContext = createContext<SearchInputState>({
    focus: () => null,
    blur: () => null,
    inputRef: null
});

export function ProvideSearchInput({ children }: any) {
    const search = useProvideSearchInput();
    return (
        <searchContext.Provider value={search}>{children}</searchContext.Provider>
    );
}

export const useSearchInput = () => {
    return useContext(searchContext);
};

function useProvideSearchInput(): SearchInputState {
    const inputRef: any = useRef();

    function focus() {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    function blur() {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }

    return {
        focus,
        blur,
        inputRef
    };
}