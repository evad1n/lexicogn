// Database type
type WordDocument = {
    ID: number;
    Word: string;
    Definition: string;
    API: number;
};

// From requests
type WordResult = {
    Word: string;
    Definition: string;
    API: number;
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