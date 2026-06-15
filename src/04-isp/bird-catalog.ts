
/**
 * APLICACIÓN DEL PRINCIPIO DE SEGREGACIÓN DE INTERFACES (ISP)
 *
 * El catálogo de fauna de la reserva ecológica ya no obliga a todas
 * las aves a implementar comportamientos que no les corresponden.
 * Se dividen las capacidades en interfaces pequeñas y especializadas:
 * Eater, Flyer, Swimmer. Cada ave implementa únicamente lo que puede hacer.
 */

interface Eater {
    eat(): void;
}

interface Flyer {
    fly(): number;
}

interface Swimmer {
    swim(): void;
}

export class Toucan implements Eater, Flyer {
    public eat(): void {
        console.log('El Tucán está comiendo frutas.');
    }

    public fly(): number {
        console.log('El Tucán vuela sobre la selva.');
        return 10;
    }
}

export class Hummingbird implements Eater, Flyer {
    public eat(): void {
        console.log('El Colibrí busca néctar.');
    }

    public fly(): number {
        console.log('El Colibrí aletea rápidamente.');
        return 5;
    }
}

export class Ostrich implements Eater {
    public eat(): void {
        console.log('El Avestruz come hierbas.');
    }
}

export class Penguin implements Eater, Swimmer {
    public eat(): void {
        console.log('El Pingüino come peces.');
    }

    public swim(): void {
        console.log('El Pingüino nada en el lago de la reserva.');
    }
}

// Demostración
(() => {
    console.log('--- ISP Demostración ---');

    const toucan = new Toucan();
    toucan.eat();
    toucan.fly();

    const hummingbird = new Hummingbird();
    hummingbird.eat();
    hummingbird.fly();

    const ostrich = new Ostrich();
    ostrich.eat();
    // ostrich.fly(); // ❌ Error de compilación: Ostrich no implementa Flyer

    const penguin = new Penguin();
    penguin.eat();
    penguin.swim();
})();
