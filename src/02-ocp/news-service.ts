
/**
 * APLICACIÓN DEL PRINCIPIO ABIERTO/CERRADO (OCP)
 *
 * El servicio de noticias y galería de la reserva ya no depende
 * directamente de axios. En su lugar, depende de una abstracción
 * (HttpClient) que puede implementarse con axios, fetch o XMLHttpRequest.
 * Si mañana surge una nueva librería HTTP, los servicios no requieren
 * modificación: solo se crea una nueva implementación de HttpClient.
 */

import { HttpClient, AxiosHttpClient, FetchHttpClient } from './http-client';

export class NewsService {
    constructor(private httpClient: HttpClient) {}

    async getLatestNews(): Promise<any[]> {
        const response = await this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/posts');
        return response.data;
    }
}

export class PhotosService {
    constructor(private httpClient: HttpClient) {}

    async getGallery(): Promise<any[]> {
        const response = await this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/photos');
        return response.data;
    }
}

export class TodoService {
    constructor(private httpClient: HttpClient) {}

    async getTodoItems(): Promise<any[]> {
        const response = await this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/todos');
        return response.data;
    }
}

// Demostración
(async () => {
    const axiosClient = new AxiosHttpClient();
    const fetchClient = new FetchHttpClient();

    const newsServiceAxios = new NewsService(axiosClient);
    const photosServiceFetch = new PhotosService(fetchClient);

    console.log('--- OCP Demostración ---');

    const news = await newsServiceAxios.getLatestNews();
    console.log('Noticias obtenidas vía Axios:', news.length);

    const photos = await photosServiceFetch.getGallery();
    console.log('Fotos obtenidas vía Fetch:', photos.length);
})();
