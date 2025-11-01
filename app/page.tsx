// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Card {
  id: number;
  imagen: string;
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

  const imagesByDifficulty = {
    facil: [
      "/memorama/facil/1.png",
      "/memorama/facil/2.png",
      "/memorama/facil/3.png",
      "/memorama/facil/4.png",
      "/memorama/facil/5.png",
      "/memorama/facil/6.png",
    ],
    medio: [
      "/memorama/medio/1.png",
      "/memorama/medio/2.png",
      "/memorama/medio/3.png",
      "/memorama/medio/4.png",
      "/memorama/medio/5.png",
      "/memorama/medio/6.png",
      "/memorama/medio/7.png",
      "/memorama/medio/8.png",
    ],
    dificil: [
      "/memorama/dificil/1.png",
      "/memorama/dificil/2.png",
      "/memorama/dificil/3.png",
      "/memorama/dificil/4.png",
      "/memorama/dificil/5.png",
      "/memorama/dificil/6.png",
      "/memorama/dificil/7.png",
      "/memorama/dificil/8.png",
      "/memorama/dificil/9.png",
      "/memorama/dificil/10.png",
      "/memorama/dificil/11.png",
      "/memorama/dificil/12.png",
    ],
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

    const emojis = imagesByDifficulty[selectedDifficulty];
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((imagen, index) => ({
        id: index,
        imagen,
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
      matchedPairs < imagesByDifficulty[difficulty].length
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

    if (cards[first].imagen === cards[second].imagen) {
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
    matchedPairs === imagesByDifficulty[difficulty].length &&
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
    <div className="min-h-screen bg-[#F2F6F9] flex  justify-center">
      <div className=" p-8 max-w-4xl w-full">
        <h1 className="text-[3rem] font-bold text-center text-gray-800 flex items-center justify-center gap-4">
          <Image
            src="/memograma.png"
            width={100}
            height={100}
            alt="Memorama Logo"
            style={{ marginRight: "2rem" }}
          /> MEMOGRAMA
        </h1>
        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center">
          <p className="text-gray-600 text-sm">
            💡 <strong>Objetivo:</strong> Encuentra todos los pares de
            emojis idénticos en el menor tiempo posible
          </p>
        </div>

        {/* Selección de dificultad */}
        {!gameStarted ? (
          <div className="text-center py-4">
            <h2 className="text-lg text-black mb-6">
              Selecciona el Nivel de Dificultad
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {/* Fácil */}
              <button
                onClick={() => initGame("facil")}
                className="group p-6 bg-[#46A84D] transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl mb-4">🥇</div>
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
                className="group p-6 bg-[#FE8111] transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl mb-4">🥈</div>
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
                className="group p-6 bg-[#F04319] transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-6xl mb-4">🥉</div>
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


          </div>
        ) : (
          <>
            {/* Panel de estadísticas */}
            <div className="flex justify-between items-center mb-8 bg-gray-100 rounded-xl p-4 flex-wrap gap-4">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2376a3]">
                    {moves}
                  </div>
                  <div className="text-sm text-black">Movimientos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F04319]">
                    {matchedPairs}/
                    {difficulty ? imagesByDifficulty[difficulty].length : 0}
                  </div>
                  <div className="text-sm text-black">Pares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#46A84D]">
                    {formatTime(timer)}
                  </div>
                  <div className="text-sm text-gray-600">Tiempo</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-2 rounded-md text-lg font-bold text-white ${difficulty === "facil"
                    ? "bg-[#46A84D]"
                    : difficulty === "medio"
                      ? "bg-[#FE8111]"
                      : "bg-[#F04319]"
                    }`}
                >
                  {difficulty === "facil"
                    ? "🥇 Fácil"
                    : difficulty === "medio"
                      ? "🥈 Medio"
                      : "🥉 Difícil"}
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
                  className={`aspect-square rounded-xl text-4xl md:text-5xl lg:text-6xl flex items-center justify-center transition-all transform hover:scale-105 ${card.flipped || card.matched
                    ? "bg-white shadow-lg"
                    : "bg-[#2376a3]"
                    } ${card.matched ? "opacity-60" : ""}`}
                >
                  {card.flipped || card.matched ? (
                    <img
                      src={card.imagen}
                      alt="card"
                      className="w-3/4 h-3/4 object-contain rounded-lg"
                    />
                  ) : (
                    ""
                  )}
                </button>
              ))}
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={backToMenu}
                className="flex-1 py-3 bg-green-500 text-white text-lg font-bold rounded-md transition-all"
              >
                ← Menú Principal
              </button>
              <button
                onClick={() => difficulty && initGame(difficulty)}
                className="flex-1 py-3 bg-amber-600 transition-all text-lg"
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
              <div className="text-6xl mb-4">🚀</div>
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
                  className="flex-1 px-6 py-3 bg-green-500 text-white font-bold rounded-md text-lg"
                >
                  Menú
                </button>
                <button
                  onClick={() => difficulty && initGame(difficulty)}
                  className="flex-1 px-6 py-3 bg-amber-600 transition-all rounded-md text-lg"
                >
                  Jugar de Nuevo
                </button>
              </div>
            </div>
          </div>
        )}
        <footer
          style={{
            textAlign: "center",
            padding: "2rem",
            opacity: 0.9,
            fontSize: "1rem",
            color: "#000",
          }}
        >
          <p>Creado a las 3 AM cuando el café ya no hacía efecto ☕💻</p>

          <Link href="https://chilehub.cl">
            <Image
              src="/chilehub.png"
              alt="Logo de Sopa de Letras"
              width={200}
              height={80}
              style={{
                width: "200px",
                height: "80px",
                objectFit: "contain",
                margin: "1rem auto",

              }}
            />
          </Link>
        </footer>
      </div>
    </div>
  );
}
