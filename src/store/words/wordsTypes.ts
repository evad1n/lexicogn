// From requests
interface WordResult {
    word: string;
    definition: string;
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
        item: WordResult;
    }
    | {
        type: "DELETE_WORD";
        id: number;
    };