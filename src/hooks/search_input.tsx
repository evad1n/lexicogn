import React, { createContext, useContext, useState } from "react";
import { TextInput } from "react-native";

interface SearchInputState {
    focus: () => void;
    blur: () => void;
    inputRef: React.LegacyRef<TextInput> | undefined;
    setRef: any;
}

// const searchContext = createContext<SearchInputState>(useProvideSearchInput());
const searchContext = createContext<SearchInputState>({
    focus: () => null,
    blur: () => null,
    inputRef: null,
    setRef: null
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
    const [inputRef, setInputRef] = useState<any>(null);

    function focus() {
        if (inputRef) {
            inputRef.focus();
        }
    }

    function blur() {
        if (inputRef) {
            inputRef.blur();
        }
    }

    function setRef(ref: any) {
        setInputRef(ref);
    }

    return {
        focus,
        blur,
        inputRef,
        setRef
    };
}