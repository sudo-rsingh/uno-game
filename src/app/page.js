import Game from '../components/Game';

export default function Home() {
  return (
    <div>
      <h1>UNO Game</h1>
      <Game players={2} />
    </div>
  );
}