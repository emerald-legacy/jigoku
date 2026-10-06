import DrawCard from '../../DrawCard.js';
import { bow } from '../../GameActions/GameActions.js';
import { CardType, Location, Players } from '../../Constants.js';

class FifthTowerWatch extends DrawCard {
    static id = 'fifth-tower-watch';

    setupCardAbilities() {
        this.interrupt('Bow a character')
            .when({
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card.controller === context.player && event.card.location === Location.PlayArea
            })
            .target({
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => card.getMilitarySkill() < context.event.card.getMilitarySkill()
            }, bow());
    }
}


export default FifthTowerWatch;
