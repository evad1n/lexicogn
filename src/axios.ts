import axios from 'axios';

const APIS = {
    autocomplete: axios.create({
        baseURL: "https://www.merriam-webster.com/lapi/v1/mwol-search/autocomplete",
    }),
    merriamWebster: axios.create({
        // baseURL: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/<word>?key=<key>",
        // https://www.merriam-webster.com/lapi/v1/mwol-search/autocomplete?search=bi
        baseURL: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/",

        params: {
            key: "068e4cc0-136d-4123-87d1-e2448716d227"
        }
    })
};


// 068e4cc0-136d-4123-87d1-e2448716d227

export default APIS;