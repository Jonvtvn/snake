"use client";

import { KeyboardEvent, useEffect, useState } from "react";

const GRID_SIZE = 30; // Number of cells in each row and column
const INITIAL_SNAKE_LENGTH = 3; // Initial length of the snake
const INITIAL_DIRECTION: Direction = "DOWN"; // Initial direction of the snake

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

type Point = {
    x: number;
    y: number;
};

export default function Home() {
    const [snake, setSnake] = useState<Point[]>([
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
    ]);
    const [food, setFood] = useState<Point>({ x: 0, y: 0 });
    const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState<boolean>(false);

    const moveSnake = (): void => {
        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        switch (direction) {
            case "UP":
                head.y -= 1;
                break;
            case "DOWN":
                head.y += 1;
                break;
            case "LEFT":
                head.x -= 1;
                break;
            case "RIGHT":
                head.x += 1;
                break;
            default:
                break;
        }

        // Check if game over
        if (
            head.x < 0 ||
            head.x >= GRID_SIZE ||
            head.y < 0 ||
            head.y >= GRID_SIZE ||
            newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
            setGameOver(true);
            return;
        }

        newSnake.unshift(head);

        // Check if snake eats food
        if (head.x === food.x && head.y === food.y) {
            generateFood();
        } else {
            newSnake.pop();
        }

        // Update the snake state
        setSnake(newSnake);
    };

    useEffect(() => {
        if (!gameOver) {
            const interval = setInterval(moveSnake, 60); // Adjust snake speed here
            return () => clearInterval(interval);
        }
    }, [snake, direction]);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = (): void => {
        const initialSnake: Point[] = [];
        for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
            initialSnake.push({ x: i, y: 0 });
        }
        setSnake(initialSnake);
        generateFood();
    };

    const generateFood = (): void => {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        setFood({ x, y });
    };


    const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>): void => {
        if ((event.key === "ArrowUp" || event.key === "w" || event.key === "W") && direction !== "DOWN") {
            setDirection("UP");
        }
        if ((event.key === "ArrowDown" || event.key === "s" || event.key === "S") && direction !== "UP") {
            setDirection("DOWN");
        }
        if ((event.key === "ArrowLeft" || event.key === "a" || event.key === "A") && direction !== "RIGHT") {
            setDirection("LEFT");
        }
        if ((event.key === "ArrowRight" || event.key === "d" || event.key === "D") && direction !== "LEFT") {
            setDirection("RIGHT");
        }

        // Restart the game on spacebar if game is over
        if (event.key === " " && gameOver) {
            setGameOver(false);
            setDirection(INITIAL_DIRECTION);
            initGame();
        }
    };



    return (
        <div
            className="flex flex-col justify-center items-center h-screen"
            onKeyDown={handleKeyPress}
            tabIndex={0}
            autoFocus
        >
            {/* Instructions */}
            <div className="mb-4 text-center">
                <p>Use the arrow keys <span className="text-2xl font-bold">↑ ↓ ← →</span> to move the snake.</p>
                <p className="text-center">
                    Press the{" "}
                    <span className="inline-block px-4 border rounded bg-gray-200 shadow-inner font-semibold text-xl">
                        ⎵
                    </span>{" "}
                    to restart after losing.
                </p>



            </div>

            {/* Grilla del juego */}
            <div
                className={`grid grid-cols-${GRID_SIZE} grid-rows-${GRID_SIZE}`}
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                    border: "4px solid black",
                }}
            >
                {gameOver && (
                    <div className="absolute inset-0 flex justify-center items-center text-9xl font-bold text-red-400">
                        Game Over!
                    </div>
                )}
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                    const x = index % GRID_SIZE;
                    const y = Math.floor(index / GRID_SIZE);
                    const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
                    const isFood = food.x === x && food.y === y;

                    return (
                        <div
                            key={index}
                            className={`w-5 h-5 border border-gray-100 ${isSnake ? "bg-emerald-400" : ""} ${isFood ? "bg-red-400" : ""}`}
                        ></div>
                    );
                })}
            </div>
        </div>
    );

}