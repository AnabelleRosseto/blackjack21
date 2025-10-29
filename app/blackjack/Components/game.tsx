
'use client'

import { useState } from "react";
import { useEffect } from "react";

import { Cardimage } from "./card-list";

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
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    console.log(data)
    return data as Deck;
}



async function fetchCard(deck_id: string, count: number) {
    const url = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    console.log(data)
    return data.cards;
}




const Game = () => {
    const [deck, setDeck] = useState<Deck | null>(null);

    const [playerCards, setPlayerCards] = useState<Card[]>([]);
    const [compCards, setCompCards] = useState<Card[]>([]);
    const [playerSum,setPlayerSum] = useState<number>(0)
    const [compSum, setCompSum] = useState<number>(0)

    const [gameResult, setGameResult] = useState<string>("")

    console.log(playerSum)
    //Cria um novo deck
    useEffect(() => {
        fetchDeck().then((data) => setDeck(data))
    }, [])

    

    function getCardNumberValue(value: string){
        
        if (Number.isNaN(parseInt(value))){
            if (value == "Ace"){
                return "11";
            }
            else{
                return "10";
            }
        }
        return value
    }

    async function drawCard() : Promise<Card[]>{
        const cc : Card[] = await fetchCard(deck!.deck_id, 1).then((card) => {
            
            card[0].value = getCardNumberValue(card[0].value)

            return card;
        });
        return cc;
    }

    function convertCard(c: Promise<Card[]>){
        console.log()
    }

    //Compra uma carta do deck e aumenta a pontuação do jogador.
    function playerBuyCard() {
        fetchCard(deck!.deck_id, 1).then((card) => setPlayerCards((prev) => {
            
            card[0].value = getCardNumberValue(card[0].value)
            
            const newCards = [...prev, ...card];
            const newSum = newCards.reduce((acc, c) => acc + parseInt(c.value), 0);
            setPlayerSum(newSum);

            return newCards;
        }));
        
        console.log("bought")
    
    }




    async function compBuyCard() {
       // O retorno da função é a Promise resultante do fetchCard.
        await drawCard().then(
        (c) => {
            setCompCards((prev) => {
            const newCards = [...prev, c[0]]
            setCompSum(newCards.reduce((acc,c) => acc + parseInt(c.value), 0))
            compTurn(newCards.reduce((acc,c) => acc + parseInt(c.value), 0))
            return newCards
            })
        }
       );
        
        
    }




    async function compTurn(sum: number) 
    {
        
        if (sum < 17) 
        {
            compBuyCard();
        } 
        else 
        {
            endGame();
        }
        // console.log({"comp sum =" : compSum})
        
    }

    function endGame(){
        if ((playerSum > 21 && compSum > 21) || playerSum === compSum){
            setGameResult("Empate!!")
        }
        else if(playerSum > compSum && playerSum < 21){
            setGameResult("Você ganhou!!")
        }
        else{
            setGameResult("Você perdeu!!")
        };
    }

    function newGame()
    {
        setPlayerCards([]);
        setCompCards([]);
        setPlayerSum(0);
        setCompSum(0);
        setGameResult("Esperando nova rodada");
        fetchDeck().then((data) => setDeck(data)).then(() => setGameResult(""));
    }
    return (
        <div className="flex flex-col justify-center items-center gap-4 w-full text-black dark:text-white">
            <h4>deck id: {deck?.deck_id}</h4>

            <h2>{gameResult}</h2>
            
            <button
            className="bg-blue-700 rounded p-2 text-white my-8"
            onClick={newGame}
            >
                Novo Jogo
            </button>

            <div className="flex flex-row justify-evenly">
                <div>
                    <h3 className="m-8">Player Cards</h3>
                    <CardList
                        cards={playerCards?.map((card) => (
                            {
                                image: card.image,
                                suit: card.suit,
                                value: card.value
                            }))} />
                    <button 
                        className="bg-blue-700 rounded p-2 text-white my-8" 
                        onClick={playerBuyCard}
                        disabled={playerSum >= 21}
                    > comprar 1 carta
                    </button>
                    <p className={` ${playerSum > 21 ? "text-neutral-600" : ""}`}> {playerSum}</p>
                </div>
                <div>
                    <h3 className="m-8">Computer Cards</h3>
                    <CardList
                        cards={compCards?.map((card) => (
                            {
                                image: card.image,
                                suit: card.suit,
                                value: card.value
                            }))} />
                    <button 
                        className="bg-blue-700 rounded p-2 text-white my-8" 
                        onClick={() => compBuyCard()}
                        disabled={gameResult != ""}
                    > Apostar
                    </button>
                    <p>{compSum}</p>
                </div>

            </div>
        </div>
    )
}
export default Game;