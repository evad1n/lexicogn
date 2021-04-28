// Base word type
interface WordDefinition {
    word: string;
    definition: string;
}

// From requests
interface WordResult extends WordDefinition {
    api: number;
};

// Database type
interface WordDocument extends WordResult {
    id: number;
    correct: number;
    incorrect: number;
};


type WordsState = {
    words: WordDocument[];
    homeWord: WordDocument | null;
};

type WordsAction =
    | {
        type: "LOAD_WORDS";
        words: WordDocument[];
    }
    | {
        type: "ADD_WORD";
        word: WordDocument;
    }
    | {
        type: "DELETE_WORD";
        id: number;
    }
    | {
        type: "UPDATE_WORD";
        word: WordDocument;
    };