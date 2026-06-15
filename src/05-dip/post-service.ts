
/**
 * APLICACIÓN DEL PRINCIPIO DE INVERSIÓN DE DEPENDENCIAS (DIP)
 *
 * El servicio de publicaciones de la reserva ecológica ya no depende
 * de una implementación concreta de base de datos. En su lugar, depende
 * de la abstracción PostProvider. Esto permite cambiar entre una base
 * de datos local, un archivo JSON o una API externa sin modificar
 * PostService.
 */

import { PostProvider } from '../data/local-database';

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export class PostService {
    private posts: Post[] = [];

    constructor(private postProvider: PostProvider) {}

    async getPosts(): Promise<Post[]> {
        this.posts = await this.postProvider.getPosts();
        return this.posts;
    }
}

// Demostración
(async () => {
    const { LocalDatabaseService, JsonDatabaseService, ApiService } = await import('../data/local-database');

    console.log('--- DIP Demostración ---');

    const localProvider = new LocalDatabaseService();
    const localPostService = new PostService(localProvider);
    const localPosts = await localPostService.getPosts();
    console.log('Posts desde base de datos local:', localPosts.length);

    const jsonProvider = new JsonDatabaseService();
    const jsonPostService = new PostService(jsonProvider);
    const jsonPosts = await jsonPostService.getPosts();
    console.log('Posts desde archivo JSON:', jsonPosts.length);

    const apiProvider = new ApiService();
    const apiPostService = new PostService(apiProvider);
    const apiPosts = await apiPostService.getPosts();
    console.log('Posts desde API externa:', apiPosts.length);
})();
