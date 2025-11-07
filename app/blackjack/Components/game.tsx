
'use client'

import { useEffect, useState } from "react";

import CardList from "./card-list";


export interface Deck {
    "success": boolean,
    "deck_id": string,
    "shuffled": boolean,
    "remaining": number
}
interface Card {
    code: string,
    image: string,
    images: {
        svg: string,
        png: string
    },
    value: string,
    suit: string
}
async function fetchDeck() {
    const url = 'https://deckofcardsapi.com/api/deck/new/shuffle'
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const data = await response.json();
    // console.log(data)
    return data as Deck;
}



async function fetchCard(deck_id: string, count: number) {
    const url = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    // console.log(data)
    return data.cards;
}




const Game = () => {

    const [deck, setDeck] = useState<Deck | null>(null);

    //cards e pontuações
    const [playerCards, setPlayerCards] = useState<Card[]>([]);
    const [compCards, setCompCards] = useState<Card[]>([]);
    const [playerSum,setPlayerSum] = useState<number>(0);
    const [compSum, setCompSum] = useState<number>(0);
    
    //resultado (texto mostrado)
    const [gameResult, setGameResult] = useState<string>("");

    //variáveis de controle
    const [gameRunning, setGameRunning] = useState<boolean>(false);
    const [runningComp, setRunningComp] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);

    function getCardNumberValue(value: string){
        
        if (Number.isNaN(parseInt(value))){
            if (value == "Ace"){
                return "11";
            }
            else{
                return "10";
            }
        }
        return value;
    }

    async function drawCard() : Promise<Card[]>{
        setLoading(true)
        const cc : Card[] = await fetchCard(deck!.deck_id, 1).then((card) => {
            
            card[0].value = getCardNumberValue(card[0].value)
            return card;
        }).catch(() => setGameResult("Não conseguimos comprar uma carta nova :(")
    ).finally(() => setLoading(false));
        return cc;
    }

    //Compra uma carta do deck e aumenta a pontuação do jogador.
    function playerBuyCard() {
        drawCard().then((card) => setPlayerCards((prev) => {
            
            card[0].value = getCardNumberValue(card[0].value);
            
            const newCards = [...prev, ...card];
            const newSum = newCards.reduce((acc, c) => acc + parseInt(c.value), 0);
            setPlayerSum(newSum);

            return newCards;
        }));
        
        //console.log("bought")
    
    }



    async function compTurn(ccard: Card[], csum: number) {
        if (!runningComp){
            setRunningComp(true);
        }
        
        if (csum < 17) 
        {
            await drawCard().then((c) => {
                let nc:Card[] = [...ccard, ...c]
                setCompCards((prev) => {
                    const newCards = [...prev, c[0]];
                    const sum = newCards.reduce((acc,c) => acc + parseInt(c.value), 0);
                    setCompSum(sum);
                    
                    return newCards;
                })
                return nc
            }).then((nc:Card[]) => {
                const sum = nc.reduce((acc,c) => acc + parseInt(c.value), 0);
                compTurn(nc, sum);
            });
        } 
        else 
        {
            endGame(csum);
        }
    }    
    

    function endGame(csum: number){
        
        setGameRunning(false);
        setRunningComp(false);
        // console.log(`player sum = ${playerSum} \ncomp sum = ${csum}`);
        if ((playerSum > 21 && csum > 21) || playerSum == csum){
            setGameResult("Empate!!");
        }
        else if((playerSum > csum && playerSum <= 21) || csum > 21){
            setGameResult("Você ganhou!!");
        }
        else{
            setGameResult("Você perdeu!!");
        };
    }


    //inicializa o jogo
    function newGame()
    {
        setGameRunning(false)
        setPlayerCards([]);
        setCompCards([]);
        setPlayerSum(0);
        setCompSum(0);
        setLoading(true)
        setGameResult("Esperando nova rodada");
        setRunningComp(false)
        fetchDeck().then((data) => setDeck(data)).then(() => {
            setGameResult("FaçaSuaAposta");
            setGameRunning(true);
        }
        ).catch(() => setGameResult("Não conseguimos achar o baralho de cartas :(")
        ).finally(() => setLoading(false));
    }


    //chama a função de inicializar o jogo quando o objeto é carregado
    useEffect(() => newGame(), [])


    return (
        <div className="flex flex-col justify-center items-center gap-4 w-full max-h-fit text-black dark:text-white">
            <h4>deck id: {deck?.deck_id}</h4>

            <h2>{gameResult}</h2>
            
            <button
            className={`bg-pink-700 
                border-4 
                border-t-pink-300 border-l-pink-300
                border-b-pink-900 border-r-pink-900
                rounded p-2 text-white my-8`}
            onClick={newGame}
            disabled={loading}
            >
                Novo Jogo
            </button>

            <div className="flex flex-col md:flex-row justify-evenly">
                <div className=" mx-10 p-0 md:p-10 flex-1 min-w-fit justify-items-center">
                    <button 
                        className={` rounded p-2  my-8 border-4
                                ${!(gameRunning && playerSum <= 21) ? `bg-gray-700 
                                    cursor-not-allowed 
                                    text-neutral-500  border-t-neutral-700 border-l-neutral-700` : `bg-blue-500 
                                    border-l-blue-400 border-t-blue-400  
                                    border-b-blue-700 border-r-blue-700
                                    text-white`
                                } `
                            } 
                        onClick={playerBuyCard}
                        disabled={(playerSum > 21 || !gameRunning) || loading}
                    > comprar 1 carta
                    </button>
                    
                    {/* Pontuação Jogador */}
                    <div className="flex flex-row justify-evenly">
                        <h3 className="">Jogador: </h3>
                        <h3 className={` ${playerSum > 21 ? "text-neutral-600" : ""}`}> {playerSum}</h3>
                    </div>
                    
                    <CardList
                        
                        cards={playerCards?.map((card) => (
                            {
                                image: card.image,
                                suit: card.suit,
                                value: card.value
                            }))
                        } 
                    />
                    
                    
                </div>
                <div className="mx-10 p-0 md:p-10 flex-1 min-w-fit justify-items-center">

                    <button 
                        className={` rounded p-2  my-8 border-4
                            ${!(gameRunning && !runningComp) ? "bg-gray-700 cursor-not-allowed border-l-neutral-700 border-t-neutral-700 text-neutral-500" : 
                                "bg-orange-500 border-t-orange-400 border-l-orange-400 border-b-orange-700 border-r-orange-700 text-white"} `}
                        onClick={() => compTurn(compCards, compSum)}
                        disabled={!gameRunning && runningComp}
                    > Apostar
                    </button>
                     
                    {/* pontuação Casa */}
                    <div className="flex flex-row justify-evenly">
                        <h3 className="">Casa: </h3>
                        <h3 className={` ${compSum > 21 ? "text-neutral-600" : ""}`}> {compSum}</h3>
                    </div>

                    <CardList
                        color="orange"
                        cards={compCards?.map((card) => (
                            {
                                image: card.image,
                                suit: card.suit,
                                value: card.value
                            }))} 
                    />
                    
                </div>

            </div>
        </div>
    )
}
export default Game;