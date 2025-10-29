

interface CardListProps {
    cards?: Cardimage[];
}

export interface Cardimage{
    image: string,
    suit: string,
    value: string
}


const CardList = ({ cards }: CardListProps) => {
    return (
        <div className="grid grid-cols-2 justify-center items-center gap-2 h-70 grid-rows-3 object-contain">
            {cards?.length ? cards.map((card, index) => (
                <img key={index} src={card.image} alt={`An ${card.value} of ${card.suit} card`} className="h-36"/>
            )): null}
        </div>
    );
}
export default CardList;