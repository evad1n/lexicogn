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
};



type WordsState = WordDocument[];

type WordsAction =
    | {
        type: "LOAD_WORDS";
        data: WordDocument[];
    }
    | {
        type: "ADD_WORD";
        item: WordDocument;
    }
    | {
        type: "DELETE_WORD";
        id: number;
    };