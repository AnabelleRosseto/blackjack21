

interface CardListProps {
    cards?: Cardimage[];
    color?: string;
}

export interface Cardimage{
    image: string,
    suit: string,
    value: string
}


const CardList = ({ cards, color = "blue" }: CardListProps) => {
    return (
        <div className={`
            grid grid-flow-col
            grid-cols-4
            md:grid-flow-row 
            md:grid-cols-2 
            justify-center items-center 
            gap-2 
            p-2
            border-2 
            border-b-${color}-900 border-r-${color}-900 
            border-l-${color}-500 border-t-${color}-500 
            rounded-md
            overflow-auto 
            md:max-h-80
            `
            }>
            {cards?.length ? cards.map((card, index) => (
                <img key={index} src={card.image} alt={`${card.value} of ${card.suit} card`} className="min-w-fit h-20 md:h-36"/>
            )): null}
        </div>
    );
}
export default CardList;