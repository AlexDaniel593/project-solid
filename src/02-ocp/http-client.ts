
/**
 * HTTP CLIENT ABSTRACTION
 *
 * Abstracción que permite a los servicios de la reserva ecológica
 * consumir APIs sin acoplarse a una librería específica.
 */

import axios from 'axios';

export interface HttpResponse<T = unknown> {
    data: T;
    status: number;
}

export abstract class HttpClient {
    abstract get<T>(url: string): Promise<HttpResponse<T>>;
}

export class AxiosHttpClient extends HttpClient {
    async get<T>(url: string): Promise<HttpResponse<T>> {
        const response = await axios.get<T>(url);
        return {
            data: response.data,
            status: response.status,
        };
    }
}

export class FetchHttpClient extends HttpClient {
    async get<T>(url: string): Promise<HttpResponse<T>> {
        const response = await fetch(url);
        const data = await response.json() as T;
        return {
            data,
            status: response.status,
        };
    }
}
