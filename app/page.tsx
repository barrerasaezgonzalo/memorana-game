// app/page.tsx
"use client";
import { useState, useEffect } from "react";

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

type Difficulty = "facil" | "medio" | "dificil" | null;

export default function MemoramaGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(null);

  // Emojis por dificultad
  const emojisByDifficulty = {
    facil: ["🎮", "🎯", "🎨", "🎭", "🎪", "🎸"], // 6 pares = 12 cartas
    medio: ["🎮", "🎯", "🎨", "🎭", "🎪", "🎸", "🎹", "🎺"], // 8 pares = 16 cartas
    dificil: [
      "🎮",
      "🎯",
      "🎨",
      "🎭",
      "🎪",
      "🎸",
      "🎹",
      "🎺",
      "🎻",
      "🎬",
      "🎤",
      "🎧",
    ], // 12 pares = 24 cartas
  };

  // Grid columns por dificultad
  const gridColsByDifficulty = {
    facil: "grid-cols-3 md:grid-cols-4",
    medio: "grid-cols-4",
    dificil: "grid-cols-4 md:grid-cols-6",
  };

  // Inicializar el juego
  const initGame = (selectedDifficulty: Difficulty) => {
    if (!selectedDifficulty) return;

    const emojis = emojisByDifficulty[selectedDifficulty];
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameStarted(true);
    setTimer(0);
    setDifficulty(selectedDifficulty);
  };

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      gameStarted &&
      difficulty &&
      matchedPairs < emojisByDifficulty[difficulty].length
    ) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, matchedPairs, difficulty]);

  // Manejar click en carta
  const handleCardClick = (cardId: number) => {
    if (
      isChecking ||
      flippedCards.length === 2 ||
      flippedCards.includes(cardId) ||
      cards[cardId].matched
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      checkMatch(newFlippedCards);
    }
  };

  // Verificar si hay match
  const checkMatch = (flipped: number[]) => {
    setIsChecking(true);
    const [first, second] = flipped;

    if (cards[first].emoji === cards[second].emoji) {
      // ¡Match!
      const newCards = [...cards];
      newCards[first].matched = true;
      newCards[second].matched = true;
      setCards(newCards);
      setMatchedPairs(matchedPairs + 1);
      setFlippedCards([]);
      setIsChecking(false);
    } else {
      // No match
      setTimeout(() => {
        const newCards = [...cards];
        newCards[first].flipped = false;
        newCards[second].flipped = false;
        setCards(newCards);
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Verificar si ganó
  const hasWon =
    difficulty &&
    matchedPairs === emojisByDifficulty[difficulty].length &&
    gameStarted;

  // Volver al menú
  const backToMenu = () => {
    setGameStarted(false);
    setDifficulty(null);
    setCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setTimer(0);
  };

  return (
    <div className="min-h-screen bg-[#3aaeab] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🎮 Memorama
        </h1>

        {/* Selección de dificultad */}
        {!gameStarted ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Selecciona el Nivel de Dificultad
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {/* Fácil */}
              <button
                onClick={() => initGame("facil")}
                className="group p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl mb-4">😊</div>
                <h3 className="text-2xl font-bold text-white mb-2">Fácil</h3>
                <p className="text-white text-sm mb-4">12 cartas (6 pares)</p>
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full aspect-square bg-white bg-opacity-30 rounded"
                    />
                  ))}
                </div>
              </button>

              {/* Medio */}
              <button
                onClick={() => initGame("medio")}
                className="group p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-white mb-2">Medio</h3>
                <p className="text-white text-sm mb-4">16 cartas (8 pares)</p>
                <div className="grid grid-cols-4 gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full aspect-square bg-white bg-opacity-30 rounded"
                    />
                  ))}
                </div>
              </button>

              {/* Difícil */}
              <button
                onClick={() => initGame("dificil")}
                className="group p-6 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl hover:from-red-500 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl mb-4">😤</div>
                <h3 className="text-2xl font-bold text-white mb-2">Difícil</h3>
                <p className="text-white text-sm mb-4">24 cartas (12 pares)</p>
                <div className="grid grid-cols-4 gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full aspect-square bg-white bg-opacity-30 rounded"
                    />
                  ))}
                </div>
              </button>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-xl">
              <p className="text-gray-600 text-sm">
                💡 <strong>Objetivo:</strong> Encuentra todos los pares de
                emojis idénticos en el menor tiempo posible
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Panel de estadísticas */}
            <div className="flex justify-between items-center mb-8 bg-gray-100 rounded-xl p-4 flex-wrap gap-4">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {moves}
                  </div>
                  <div className="text-sm text-gray-600">Movimientos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {matchedPairs}/
                    {difficulty ? emojisByDifficulty[difficulty].length : 0}
                  </div>
                  <div className="text-sm text-gray-600">Pares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatTime(timer)}
                  </div>
                  <div className="text-sm text-gray-600">Tiempo</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                    difficulty === "facil"
                      ? "bg-green-500"
                      : difficulty === "medio"
                        ? "bg-orange-500"
                        : "bg-red-500"
                  }`}
                >
                  {difficulty === "facil"
                    ? "😊 Fácil"
                    : difficulty === "medio"
                      ? "🤔 Medio"
                      : "😤 Difícil"}
                </span>
              </div>
            </div>

            {/* Tablero de juego */}
            <div
              className={`grid ${difficulty ? gridColsByDifficulty[difficulty] : "grid-cols-4"} gap-4 mb-8`}
            >
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.matched || card.flipped}
                  className={`aspect-square rounded-xl text-4xl md:text-5xl lg:text-6xl flex items-center justify-center transition-all transform hover:scale-105 ${
                    card.flipped || card.matched
                      ? "bg-white shadow-lg"
                      : "bg-[#2376a3]"
                  } ${card.matched ? "opacity-60" : ""}`}
                >
                  {card.flipped || card.matched ? card.emoji : "❓"}
                </button>
              ))}
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={backToMenu}
                className="flex-1 py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-all"
              >
                ← Menú Principal
              </button>
              <button
                onClick={() => difficulty && initGame(difficulty)}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                🔄 Reiniciar
              </button>
            </div>
          </>
        )}

        {/* Modal de victoria */}
        {hasWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                ¡Felicitaciones!
              </h2>
              <div className="mb-6 space-y-2">
                <p className="text-gray-600">
                  <strong>Nivel:</strong>{" "}
                  {difficulty === "facil"
                    ? "Fácil 😊"
                    : difficulty === "medio"
                      ? "Medio 🤔"
                      : "Difícil 😤"}
                </p>
                <p className="text-gray-600">
                  <strong>Movimientos:</strong> {moves}
                </p>
                <p className="text-gray-600">
                  <strong>Tiempo:</strong> {formatTime(timer)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={backToMenu}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-all"
                >
                  Menú
                </button>
                <button
                  onClick={() => difficulty && initGame(difficulty)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Jugar de Nuevo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
