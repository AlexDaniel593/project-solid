# Proyecto de Refactorización SOLID — Reserva Ecológica

Este proyecto es una refactorización progresiva de cinco módulos que violaban los principios SOLID, aplicados al contexto de una **Reserva Ecológica** (inventario de souvenirs, flota de vehículos, catálogo de fauna y servicio de noticias/publicaciones).

## Instrucciones de ejecución

```bash
npm install
npm run dev
```

Descomenta el import correspondiente en `src/main.ts` para probar cada principio.

---

## Hoja de Ruta de Refactorización

| Principio | Rama | Archivos | Commit semántico |
|-----------|------|----------|------------------|
| **SRP** | `feat/srp-refactor` | `src/01-srp/product-bloc.ts` | `feat(srp): separate ProductService and EmailService from ProductBloc` |
| **OCP** | `feat/ocp-refactor` | `src/02-ocp/news-service.ts`, `src/02-ocp/http-client.ts` | `feat(ocp): add HttpClient abstraction to decouple HTTP services from axios` |
| **LSP** | `feat/lsp-refactor` | `src/03-lsp/vehicle-manager.ts` | `feat(lsp): replace instanceof checks with polymorphic Vehicle abstraction` |
| **ISP** | `feat/isp-refactor` | `src/04-isp/bird-catalog.ts` | `feat(isp): split fat Bird interface into role-specific interfaces` |
| **DIP** | `feat/dip-refactor` | `src/05-dip/post-service.ts`, `src/data/local-database.ts` | `feat(dip): inject PostProvider abstraction into PostService` |

---

## Bitácora de Reflexión SOLID

### 1. SRP — Single Responsibility Principle (Responsabilidad Única)

**Desafío:** `ProductBloc` gestiona inventario y envía correos.
**Acción:** Crea servicios especializados.
**Commit:** `feat(srp): separate ProductService and EmailService from ProductBloc`

#### Antes
La clase `ProductBloc` era un componente que cargaba productos, guardaba productos y enviaba correos electrónicos. Esto violaba SRP porque tenía más de una razón para cambiar.

```typescript
loadProduct(id: number) { ... }
saveProduct(product: Product) { ... }
notifyCustomer(email: string, message: string) { ... }
```

#### Después
Se separaron tres responsabilidades:
- `ProductService`: se encarga exclusivamente de la persistencia de productos.
- `EmailService`: se encarga exclusivamente del envío de notificaciones.
- `ProductBloc`: actúa como orquestador, delegando a los servicios inyectados.

```typescript
class ProductBloc {
    constructor(
        private productService: ProductService,
        private emailService: EmailService
    ) {}
}
```

#### Reflexión crítica
**¿Qué pasaría si mañana decidimos notificar por WhatsApp en lugar de Email? ¿Cuántas clases tendrías que modificar ahora vs. antes?**

**Antes:** Tendríamos que modificar `ProductBloc`, arriesgando romper accidentalmente la lógica de inventario. Además, si `notifyCustomer` estaba acoplada a SMTP, habría que reescribir el método interno, tocar tests y validar que el inventario siguiera funcionando.

**Ahora:** **Cero clases existentes modificadas.** Solo crearíamos un nuevo `WhatsAppService` que implemente la misma interfaz de notificación, y lo inyectaríamos en `ProductBloc` en el punto de entrada. `ProductBloc`, `ProductService` y el resto del sistema permanecen intactos. Esto demuestra que separar responsabilidades no es solo organización, sino **protección contra cambios imprevistos**.

---

### 2. OCP — Open/Closed Principle (Abierto/Cerrado)

**Desafío:** Dependencia rígida de `axios`.
**Acción:** Implementa el patrón Adaptador.
**Commit:** `feat(ocp): add HttpClient abstraction to decouple HTTP services from axios`

#### Antes
`NewsService` y `PhotosService` dependían directamente de `axios.get()`. Si queríamos cambiar de librería, tendríamos que abrir estos servicios y modificarlos internamente.

```typescript
async getLatestNews() {
    const resp = await axios.get('...');
    return resp.data;
}
```

#### Después
Se introdujo la abstracción `HttpClient` con dos implementaciones: `AxiosHttpClient` y `FetchHttpClient`. Los servicios reciben `HttpClient` por constructor, sin saber qué implementación concreta usan.

```typescript
export abstract class HttpClient {
    abstract get<T>(url: string): Promise<HttpResponse<T>>;
}

export class AxiosHttpClient extends HttpClient { ... }
export class FetchHttpClient extends HttpClient { ... }
```

#### Reflexión crítica
**Si se detecta una vulnerabilidad en axios y debes migrar a fetch en minutos, ¿qué tan rápido lo harías con este diseño?**

**Con este diseño:** En minutos. Creamos un nuevo `FetchHttpClient` (o ya existe) y simplemente cambiamos la instancia que inyectamos en los servicios. `NewsService`, `PhotosService` y `TodoService` **no se tocan**. Es cambiar una línea en el punto de entrada:

```typescript
const httpClient = new FetchHttpClient(); // Antes: new AxiosHttpClient()
const newsService = new NewsService(httpClient);
```

**Antes:** Tendríamos que buscar archivo por archivo donde se usa `axios.get`, reemplazar, probar y rezar que no haya comportamientos sutiles de axios que fetch no replique. Sería un cambio arriesgado y lento.

Esto demuestra que OCP no es un ideal teórico: es **seguridad operacional** cuando una dependencia deja de ser confiable.

---

### 3. LSP — Liskov Substitution Principle (Sustitución de Liskov)

**Desafío:** `VehicleManager` usa `instanceof`.
**Acción:** Define un contrato común.
**Commit:** `feat(lsp): replace instanceof checks with polymorphic Vehicle abstraction`

#### Antes
`VehicleManager` usaba `instanceof` para cada marca. Si se agregaba una nueva marca, había que modificar `VehicleManager` agregando otro `if`.

```typescript
if (vehicle instanceof Tesla) {
    console.log('Tesla Model:', vehicle.model, 'Carga eléctrica al 100%');
}
if (vehicle instanceof Audi) {
    console.log('Audi Model:', vehicle.model, 'Tracción Quattro activada');
}
// ... y así para cada marca
```

#### Después
Se creó una jerarquía polimórfica con `Vehicle` como clase abstracta y cada marca implementando `getDetails()`. `VehicleManager` itera sobre `Vehicle[]` y llama el método polimórficamente.

```typescript
export abstract class Vehicle {
    constructor(public model: string) {}
    abstract getDetails(): string;
}

export class Volvo extends Vehicle {
    getDetails(): string {
        return `Volvo Model: ${this.model} — Seguridad escandinava activada`;
    }
}
```

#### Reflexión crítica
**Si la reserva adquiere un "Dron", ¿podría tu manager procesarlo sin añadir nuevos if/else?**

**Sí, sin duda.** El `Dron` solo necesitaría extender `Vehicle` e implementar `getDetails()`:

```typescript
export class Dron extends Vehicle {
    getDetails(): string {
        return `Dron Model: ${this.model} — Vuelo de vigilancia activado`;
    }
}
```

`VehicleManager` lo procesaría automáticamente porque no sabe (ni le importa) si es un `Tesla`, un `Volvo` o un `Dron`. El polimorfismo lo maneja todo.

**Antes:** Tendríamos que agregar `if (vehicle instanceof Dron)` en `VehicleManager`, violando OCP y LSP simultáneamente. El `instanceof` rompe la transparencia de la abstracción: el cliente se ve obligado a conocer los detalles internos de cada clase.

Esto demuestra que LSP es la **puerta de entrada al polimorfismo real**: si las subclases no son sustituibles, la abstracción es una ilusión.

---

### 4. ISP — Interface Segregation Principle (Segregación de Interfaces)

**Desafío:** Interfaz `Bird` obliga a nadar/volar.
**Acción:** Segrega en capacidades.
**Commit:** `feat(isp): split fat Bird interface into role-specific interfaces`

#### Antes
La interfaz `Bird` era "gorda" y obligaba a todas las aves a implementar `eat()`, `fly()` y `swim()`. Esto forzaba a `Toucan` a tener un método vacío, a `Hummingbird` a lanzar una excepción, y a `Ostrich` a lanzar una excepción en `fly()`.

```typescript
interface Bird {
    eat(): void;
    fly(): void;
    swim(): void;
}

export class Ostrich implements Bird {
    public fly() { throw new Error('Las avestruces NO vuelan.'); }
}
```

#### Después
Se dividieron las capacidades en interfaces pequeñas y especializadas:
- `Eater`: `eat()`
- `Flyer`: `fly()`
- `Swimmer`: `swim()`

Cada ave implementa solo las interfaces que puede cumplir.

```typescript
export class Ostrich implements Eater {
    public eat() { console.log('El Avestruz come hierbas.'); }
}

export class Penguin implements Eater, Swimmer {
    public eat() { console.log('El Pingüino come peces.'); }
    public swim() { console.log('El Pingüino nada en el lago.'); }
}
```

#### Reflexión crítica
**¿Cómo evita tu diseño que un "Pingüino" tenga un método fly() que lance errores?**

**En nuestro diseño, es imposible.** `Penguin` implementa `Eater` y `Swimmer`, pero **nunca `Flyer`**. Si un desarrollador intenta llamar `fly()` sobre un `Penguin`, el compilador de TypeScript genera un error en tiempo de compilación:

```typescript
const penguin = new Penguin();
penguin.fly();
```

**Antes:** El `Penguin` (o cualquier ave no voladora) estaría obligado a implementar `fly()` para satisfacer la interfaz `Bird`. Esto generaba dos problemas peligrosos:
1. **Métodos vacíos:** El `Toucan` tenía `swim()` vacío, lo cual es código muerto que confunde.
2. **Excepciones en tiempo de ejecución:** El `Ostrich` lanzaba `throw new Error()` en `fly()`, un riesgo operativo en producción.

Esto demuestra que ISP no es solo "organizar interfaces": es **prevenir errores de diseño que el compilador debería haber atrapado**.

---

### 5. DIP — Dependency Inversion Principle (Inversión de Dependencias)

**Desafío:** `PostService` instancia dependencias concretas.
**Acción:** Inyección por constructor.
**Commit:** `feat(dip): inject PostProvider abstraction into PostService`

#### Antes
`PostService` instanciaba directamente `LocalDatabaseService` dentro de su método. El módulo de alto nivel dependía de un módulo de bajo nivel, generando acoplamiento rígido.

```typescript
const databaseProvider = new LocalDatabaseService();
this.posts = await databaseProvider.getFakePosts();
```

#### Después
Se creó la abstracción `PostProvider` con tres implementaciones: `LocalDatabaseService`, `JsonDatabaseService` y `ApiService`. `PostService` recibe `PostProvider` por constructor.

```typescript
export abstract class PostProvider {
    abstract getPosts(): Promise<Post[]>;
}

export class PostService {
    constructor(private postProvider: PostProvider) {}

    async getPosts(): Promise<Post[]> {
        this.posts = await this.postProvider.getPosts();
        return this.posts;
    }
}
```

Además, se eliminó el tipo `any[]` y se creó la interfaz `Post` con tipado estricto.

#### Reflexión crítica
**¿Qué tan fácil es inyectar un "MockDatabase" para pruebas unitarias ahora?**

**Extremadamente fácil.** Solo creamos una clase que implemente `PostProvider`:

```typescript
class MockDatabaseService implements PostProvider {
    async getPosts(): Promise<Post[]> {
        return [
            { userId: 1, id: 1, title: 'Mock Post', body: 'Datos de prueba' }
        ];
    }
}
```

Y la inyectamos en `PostService` sin tocar una sola línea de código de producción:

```typescript
const mockService = new PostService(new MockDatabaseService());
const posts = await mockService.getPosts();
// Test: verificar que posts tenga el mock correcto
```

**Antes:** Era imposible. `PostService` hacía `new LocalDatabaseService()` internamente, sin forma de interceptar esa instancia. Para probar `PostService` tendríamos que:
1. Modificar el código para aceptar un parámetro (rompiendo el principio mientras lo probamos).
2. O usar herramientas de monkey-patching que son frágiles y propensas a errores.

Esto demuestra que DIP no es solo "buena arquitectura": es **habilitar tests unitarios sin hacks**.

---

## Conclusión

La refactorización aplicó los cinco principios SOLID de forma coherente, conectando cada principio con un problema real del sistema de la Reserva Ecológica:

| Principio | Problema real | Solución aplicada |
|-----------|---------------|-------------------|
| **SRP** | `ProductBloc` hacía todo | Separar en `ProductService`, `EmailService` y `CartBloc` |
| **OCP** | Dependencia rígida a `axios` | Abstracción `HttpClient` con implementaciones intercambiables |
| **LSP** | `instanceof` para cada vehículo | Jerarquía polimórfica `Vehicle` con `getDetails()` |
| **ISP** | Interfaz `Bird` gorda | Interfaces pequeñas: `Eater`, `Flyer`, `Swimmer` |
| **DIP** | Instanciación directa de base de datos | Abstracción `PostProvider` inyectada en `PostService` |

El resultado es un **código totalmente desacoplado, altamente mantenible y extensible**. Se puede agregar un nuevo vehículo, una nueva ave, un nuevo cliente HTTP o un nuevo proveedor de datos sin tocar código existente, demostrando que los principios SOLID no son teoría abstracta, sino herramientas prácticas para construir software resiliente.
