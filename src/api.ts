import axios from 'axios';

import secrets from './secrets';

export type APIType = {
    name: string,
    get: (word: string) => any;
    parseResponse: (response: any) => string;
};

export async function AutoComplete(word: string): Promise<string[]> {
    try {
        let response = await axios.get(`https://www.merriam-webster.com/lapi/v1/mwol-search/autocomplete`, {
            params: {
                search: word
            }
        });
        return response.data.docs.map((doc: any) => doc.word);
    } catch (error) {
        return [];
    }
}

const APIS: APIType[] = [
    // Custom API type = 0
    {
        name: "custom",
        get: (word: string) => "",
        parseResponse: (response: any) => "",
    },
    {
        name: "merriam-webster",
        get: (word: string) => {
            return axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`, {
                params: {
                    key: secrets.MERRIAM_WEBSTER_KEY
                }
            });
        },
        parseResponse: (response) => {
            try {
                return response.data[0].shortdef[0];
            } catch (error) {
                return null;
            }
        }
    },
    {
        // params: {term: <word>}
        name: "urban-dictionary",
        get: (word: string) => {
            return axios.get(`https://mashape-community-urban-dictionary.p.rapidapi.com/define`, {
                headers: {
                    "x-rapidapi-key": secrets.URBAN_DICT_KEY,
                    "x-rapidapi-host": secrets.URBAN_DICT_HOST,
                },
                params: {
                    term: word
                }
            });
        },
        parseResponse: (response) => {
            try {
                let def = response.data.list[0].definition;
                // Remove [] because urban dictionary uses these as links
                return def.replace(/\[|\]/g, '');
            } catch (error) {
                return null;
            }
        }
    },
];

// Maybe do this eventually?
// https://docs.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository

// Google images search format
// https://www.google.com/search?tbm=isch&q=<word>

export default APIS;