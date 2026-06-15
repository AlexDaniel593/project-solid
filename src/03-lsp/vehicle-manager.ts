
/**
 * APLICACIÓN DEL PRINCIPIO DE SUSTITUCIÓN DE LISKOV (LSP)
 *
 * La flota de vehículos de la reserva ecológica se modela como una
 * jerarquía polimórfica. Cada vehículo implementa getDetails() a su
 * manera. VehicleManager itera sobre Vehicle[] sin necesidad de conocer
 * la marca concreta. Agregar una nueva marca (ej. Volvo) no requiere
 * modificar VehicleManager, demostrando extensibilidad real.
 */

export abstract class Vehicle {
    constructor(public model: string) {}
    abstract getDetails(): string;
}

export class Tesla extends Vehicle {
    getDetails(): string {
        return `Tesla Model: ${this.model} — Carga eléctrica al 100%`;
    }
}

export class Audi extends Vehicle {
    getDetails(): string {
        return `Audi Model: ${this.model} — Tracción Quattro activada`;
    }
}

export class Toyota extends Vehicle {
    getDetails(): string {
        return `Toyota Model: ${this.model} — Motor híbrido listo`;
    }
}

export class Honda extends Vehicle {
    getDetails(): string {
        return `Honda Model: ${this.model} — VTEC activado`;
    }
}

export class Ford extends Vehicle {
    getDetails(): string {
        return `Ford Model: ${this.model} — Built Tough`;
    }
}

export class Volvo extends Vehicle {
    getDetails(): string {
        return `Volvo Model: ${this.model} — Seguridad escandinava activada`;
    }
}

export class VehicleManager {
    static printVehicleDetails(vehicles: Vehicle[]): void {
        vehicles.forEach(vehicle => {
            console.log(vehicle.getDetails());
        });
    }
}


(() => {
    const vehicles: Vehicle[] = [
        new Tesla('Model S'),
        new Audi('Q5'),
        new Toyota('RAV4'),
        new Honda('Civic'),
        new Ford('F-150'),
        new Volvo('XC90'),
    ];

    console.log('--- LSP Demostración ---');
    VehicleManager.printVehicleDetails(vehicles);
})();
