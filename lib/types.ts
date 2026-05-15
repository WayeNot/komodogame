export type Obstacle = {
    id: string;
    x: number;
    topHeight: number;
    passed: boolean;
}

export type Difficulty = "Facile" | "Intermédiaire" | "Difficile"