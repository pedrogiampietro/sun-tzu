import { useState, useEffect } from "react";
import { Village } from "./components/Village";

export function App() {
  const [characterStatus, setCharacterStatus] = useState({
    castle_id: "1007304",
    avatar: "https://github.com/pedrogiampietro.png",
    experience: 0,
    level: 1,
    buildings: [],
    population: {
      used: 0,
      max: "518",
      percent: 0,
    },
    resources: {
      gold: {
        type: 1,
        income: 35,
        max: "1890",
        amount: 503,
        percent: 26.61375661375661,
      },
      iron: {
        type: 2,
        income: 44,
        max: "1890",
        amount: 503,
        percent: 26.61375661375661,
      },
      wood: {
        type: 3,
        income: 35,
        max: "1890",
        amount: 503,
        percent: 26.61375661375661,
      },
      food: {
        type: 4,
        income: 35,
        max: "1890",
        amount: 503,
        percent: 26.61375661375661,
      },
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulando um carregamento assíncrono dos dados
    setTimeout(() => {
      setIsLoading(false); // Marca o carregamento como completo
    }, 2000); // Tempo simulado de carregamento em milissegundos
  }, []);

  // Renderiza o loading se os dados ainda estiverem sendo carregados
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Village
      characterStatus={characterStatus}
      setCharacterStatus={setCharacterStatus}
    />
  );
}

export default App;
