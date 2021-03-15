import { AxiosInstance } from 'axios';

interface APIType {
    name: string,
    http: AxiosInstance;
}

interface WordResult {
    Word: string;
    API: APIType;
    Definition: string;
}