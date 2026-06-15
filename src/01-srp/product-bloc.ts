
/**
 * APLICACIÓN DEL PRINCIPIO DE RESPONSABILIDAD ÚNICA (SRP)
 *
 * En el contexto de la Reserva Ecológica, el sistema de souvenirs
 * se divide en tres responsabilidades claramente separadas:
 * 1. ProductService: gestiona la persistencia de productos.
 * 2. EmailService: gestiona el envío de notificaciones.
 * 3. ProductBloc: orquesta la interacción entre la UI y los servicios,
 *    pero NO implementa la lógica de persistencia ni de envío de correos.
 */

interface Product {
    id: number;
    name: string;
}

class ProductService {
    private products: Product[] = [];

    getProduct(id: number): Product | undefined {
        console.log('Producto: ', { id, name: 'OLED Tv' });
        return this.products.find(p => p.id === id);
    }

    saveProduct(product: Product): void {
        console.log('Guardando en base de datos', product);
        this.products.push(product);
    }
}

class EmailService {
    private masterEmail: string = 'reserva@ecologica.ec';

    sendEmail(emailList: string[], template: 'to-clients' | 'to-admins'): void {
        console.log('Enviando correo desde ', this.masterEmail);
        console.log('Destinatarios: ', emailList);
        console.log('Usando plantilla: ', template);
    }
}

class ProductBloc {
    constructor(
        private productService: ProductService,
        private emailService: EmailService
    ) {}

    loadProduct(id: number): void {
        this.productService.getProduct(id);
    }

    saveProduct(product: Product): void {
        this.productService.saveProduct(product);
    }

    notifyClients(emailList: string[], template: 'to-clients' | 'to-admins'): void {
        this.emailService.sendEmail(emailList, template);
    }
}

class CartBloc {
    onAddToCart(productId: number): void {
        console.log('Agregando al carrito ', productId);
    }
}


(() => {
    const productService = new ProductService();
    const emailService = new EmailService();
    const productBloc = new ProductBloc(productService, emailService);
    const cartBloc = new CartBloc();

    productBloc.loadProduct(10);
    productBloc.saveProduct({ id: 10, name: 'OLED TV' });
    productBloc.notifyClients(
        ['client1@example.com', 'client2@example.com'],
        'to-clients'
    );
    cartBloc.onAddToCart(10);
})();
