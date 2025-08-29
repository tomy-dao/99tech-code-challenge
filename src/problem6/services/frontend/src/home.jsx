import React, { useState, useEffect } from "react";
import { socket } from "./App";
import auth from "./clients/auth";

const Home = ({ onLogout }) => {
  const [showAll, setShowAll] = useState(false);
  const [score, setScore] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [gameStatus, setGameStatus] = useState("inactive");
  const [scores, setScores] = useState([]);
  const displayedRange = showAll ? scores : scores.slice(0, 5);

  const handleClick = () => {
    socket.emit("click");
  };

  const openGame = () => {
    setShowGame(true);
    startGame();
  };

  const startGame = () => {
    socket.emit("start_game");
  };

  useEffect(() => {
    const startGameSignal = socket.on("start_game", (game) => {
      setGameStatus(game.status);
      setScore(0);
    });

    const startedGameSignal = socket.on("started_game", (game) => {
      setGameStatus(game.status);
      setScore(0);
    });

    const scoreSignal = socket.on("score", (score) => {
      setScore(score.value);
    });

    const countdownSignal = socket.on("countdown", (countdown) => {
      setCountdown(countdown.countdown);
    });

    const endGameSignal = socket.on("end_game", (endGame) => {
      setScore(endGame.value);
      setGameStatus(endGame.status);
    });

    const broadcastScoreSignal = socket.on(
      "broadcast_score",
      (broadcastScore) => {
        setScores((prevScores) => {
          const newScores = [...prevScores, broadcastScore];
          return newScores.sort((a, b) => b.score - a.score).slice(0, 10);
        });
      }
    );

    return () => {
      startedGameSignal.off();
      startGameSignal.off();
      scoreSignal.off();
      countdownSignal.off();
      endGameSignal.off();
      broadcastScoreSignal.off();
    };
  }, []);

  useEffect(() => {
    const getScores = async () => {
      const {scores} = await auth.getScores();
      setScores(scores);
    };
    getScores();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Top 10 Leaderboard
          </h1>
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="space-y-3 min-h-[300px] overflow-y-auto">
              {displayedRange.map((score, rank) => (
                <div
                  key={score._id}
                  className={`bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow ${
                    rank <= 2
                      ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        rank === 0
                          ? "bg-yellow-500 text-white"
                          : rank === 1
                          ? "bg-gray-400 text-white"
                          : rank === 2
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {rank + 1}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Player {score.user_id?.username}</p>
                      <p className="text-sm text-gray-500">@player{score.user_id?.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {score.score}
                    </p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Show More
              </button>
            )}
            {showAll && (
              <button
                onClick={() => setShowAll(false)}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Show Less
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Start Game Button */}
      {!showGame && (
        <div className="mt-8 text-center">
          <button
            onClick={openGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Game
          </button>
        </div>
      )}

      {/* Game Container */}
      {showGame && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Click Game in 5 seconds
          </h2>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}</div>
            <p className="text-gray-600">Your Score</p>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleClick}
              className={`
                w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold rounded-full text-xl transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                  gameStatus !== "active"
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : "hover:from-blue-500 hover:to-blue-700"
                }`}
              disabled={gameStatus !== "active"}
            >
              {countdown == 0 ? "Click Me!" : countdown}
              {/* {countdown > 0 && (
                <div className="text-sm text-gray-500">
                  {countdown}
                </div>
              )} */}
            </button>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowGame(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Hide Game
            </button>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Play again
            </button>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
