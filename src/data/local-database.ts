
/**
 * DATA PROVIDERS — DIP Implementation
 *
 * Todos los proveedores de datos implementan la abstracción PostProvider,
 * permitiendo que PostService dependa de una interfaz en lugar de una
 * implementación concreta.
 */

import { Post } from '../05-dip/post-service';

export abstract class PostProvider {
    abstract getPosts(): Promise<Post[]>;
}

export class LocalDatabaseService implements PostProvider {
    async getPosts(): Promise<Post[]> {
        return [
            {
                userId: 1,
                id: 1,
                title: 'Avistamiento de Jaguar',
                body: 'Se reportó un jaguar cerca del río principal de la reserva.'
            },
            {
                userId: 1,
                id: 2,
                title: 'Nuevas Orquídeas',
                body: 'Han florecido las especies raras en el jardín botánico.'
            }
        ];
    }
}

export class JsonDatabaseService implements PostProvider {
    async getPosts(): Promise<Post[]> {
        return [
            {
                userId: 1,
                id: 1,
                title: 'JSON Post 1',
                body: 'Contenido desde proveedor JSON local.'
            }
        ];
    }
}

export class ApiService implements PostProvider {
    async getPosts(): Promise<Post[]> {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json() as Post[];
        return data;
    }
}
