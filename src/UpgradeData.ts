export interface Upgrade {
    id: string;
    name: string;
    description: string;
    level: number;
    levelCap: number;
    prices: number[];
    dependency?: {
        upgradeId: string;
        minLevel: number;
        teaseLevel: number;
    };
    x: number; // percentage in graph
    y: number; // percentage in graph
}

export const INITIAL_UPGRADES: Upgrade[] = [
    {
        id: 'speed',
        name: 'Biber-Geschwindigkeit',
        description: 'Der Biber bewegt sich schneller, um Saftboxen rascher zu erreichen.',
        level: 0,
        levelCap: 5,
        prices: [3, 5, 8, 12, 18],
        x: 15,
        y: 50
    },
    {
        id: 'radius',
        name: 'Sammelradius',
        description: 'Erhöht die Reichweite, in der der Biber Saftboxen einsammeln kann.',
        level: 0,
        levelCap: 4,
        prices: [4, 6, 10, 15],
        dependency: {
            upgradeId: 'speed',
            minLevel: 2,
            teaseLevel: 1
        },
        x: 50,
        y: 25
    },
    {
        id: 'collectTime',
        name: 'Trinkgeschwindigkeit',
        description: 'Reduziert die Zeit, die der Biber benötigt, um eine Saftbox auszutrinken.',
        level: 0,
        levelCap: 4,
        prices: [5, 8, 12, 18],
        dependency: {
            upgradeId: 'radius',
            minLevel: 2,
            teaseLevel: 1
        },
        x: 85,
        y: 25
    },
    {
        id: 'spawner',
        name: 'Multispawner',
        description: 'Verkürzt die Spawn-Zeit von Saftboxen und lässt bis zu 2 Boxen gleichzeitig erscheinen.',
        level: 0,
        levelCap: 3,
        prices: [6, 12, 20],
        dependency: {
            upgradeId: 'speed',
            minLevel: 3,
            teaseLevel: 2
        },
        x: 50,
        y: 75
    },
    {
        id: 'golden',
        name: 'Goldener Saft',
        description: 'Gibt eine Chance, dass eine Saftbox doppelte Punkte beim Sammeln einbringt.',
        level: 0,
        levelCap: 3,
        prices: [10, 18, 25],
        dependency: {
            upgradeId: 'spawner',
            minLevel: 2,
            teaseLevel: 1
        },
        x: 85,
        y: 75
    }
];

