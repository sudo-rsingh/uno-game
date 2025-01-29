"use client"
import { useState, useEffect } from 'react';
import Card from './Card';
import ColorPicker from './ColorPicker';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
const WILDS = ['wild', 'wild4'];

const createDeck = () => {
  let deck = [];
  // Create colored cards
  COLORS.forEach(color => {
    VALUES.forEach(value => {
      deck.push({ color, value });
      if (value !== '0') deck.push({ color, value });
    });
  });
  // Create wild cards
  WILDS.forEach(wild => {
    for (let i = 0; i < 4; i++) {
      deck.push({ color: 'wild', value: wild });
    }
  });
  return deck;
};

const Game = ({ players = 2 }) => {
  const [deck, setDeck] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [playersHands, setPlayersHands] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentColor, setCurrentColor] = useState('');
  const [gameDirection, setGameDirection] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    let newDeck = createDeck();
    newDeck = shuffleDeck(newDeck);
    
    const hands = Array.from({ length: players }, () => []);
    for (let i = 0; i < 7; i++) {
      hands.forEach(hand => {
        hand.push(newDeck.pop());
      });
    }
    
    let initialCard = newDeck.pop();
    while (initialCard.color === 'wild') {
      newDeck.unshift(initialCard);
      initialCard = newDeck.pop();
    }
    
    setDeck(newDeck);
    setDiscardPile([initialCard]);
    setPlayersHands(hands);
    setCurrentColor(initialCard.color);
  };

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const isValidMove = (card) => {
    const topCard = discardPile[discardPile.length - 1];
    return (
      card.color === currentColor ||
      card.value === topCard.value ||
      card.color === 'wild'
    );
  };

  const handlePlayCard = (playerIndex, cardIndex) => {
    if (playerIndex !== currentPlayer) return;

    const card = playersHands[playerIndex][cardIndex];
    if (!isValidMove(card)) return;

    const newHand = [...playersHands[playerIndex]];
    newHand.splice(cardIndex, 1);
    
    const newPlayersHands = [...playersHands];
    newPlayersHands[playerIndex] = newHand;
    
    setDiscardPile([...discardPile, card]);
    
    if (card.color === 'wild') {
      setSelectedColor('');
      document.getElementById('color-picker-modal').showModal();
    } else {
      applyCardEffect(card);
      nextPlayer();
    }
    
    setPlayersHands(newPlayersHands);
    
    if (newHand.length === 0) {
      setWinner(playerIndex);
    }
  };

  const applyCardEffect = (card) => {
    switch (card.value) {
      case 'skip':
        nextPlayer();
        break;
      case 'reverse':
        setGameDirection(-gameDirection);
        break;
      case 'draw2':
        const next = getNextPlayer();
        drawCards(next, 2);
        nextPlayer();
        break;
      case 'wild4':
        const nextPlayer = getNextPlayer();
        drawCards(nextPlayer, 4);
        break;
    }
  };

  const drawCards = (playerIndex, count) => {
    const newHand = [...playersHands[playerIndex]];
    for (let i = 0; i < count; i++) {
      if (deck.length === 0) reshuffleDeck();
      newHand.push(deck.pop());
    }
    const newPlayersHands = [...playersHands];
    newPlayersHands[playerIndex] = newHand;
    setPlayersHands(newPlayersHands);
    setDeck([...deck]);
  };

  const reshuffleDeck = () => {
    const topCard = discardPile.pop();
    const newDeck = shuffleDeck([...discardPile]);
    setDeck(newDeck);
    setDiscardPile([topCard]);
  };

  const getNextPlayer = () => {
    let next = currentPlayer + gameDirection;
    if (next >= players) next = 0;
    if (next < 0) next = players - 1;
    return next;
  };

  const nextPlayer = () => {
    setCurrentPlayer(getNextPlayer());
  };

  const handleColorSelect = (color) => {
    setCurrentColor(color);
    setSelectedColor(color);
    document.getElementById('color-picker-modal').close();
    nextPlayer();
  };

  return (
    <div className="game-container">
      <div className="discard-pile">
        {discardPile.length > 0 && (
          <Card card={discardPile[discardPile.length - 1]} />
        )}
      </div>
      
      <div className="current-player">Current Player: {currentPlayer + 1}</div>
      
      <div className="player-hand">
        {playersHands[currentPlayer]?.map((card, index) => (
          <Card
            key={index}
            card={card}
            onClick={() => handlePlayCard(currentPlayer, index)}
          />
        ))}
      </div>

      <button onClick={() => drawCards(currentPlayer, 1)}>Draw Card</button>

      <dialog id="color-picker-modal">
        <ColorPicker onSelect={handleColorSelect} />
      </dialog>

      {winner !== null && (
        <div className="winner-message">Player {winner + 1} wins!</div>
      )}
    </div>
  );
};

export default Game;