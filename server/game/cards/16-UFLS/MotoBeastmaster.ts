import DrawCard from '../../DrawCard.js';
import { CardType, Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MotoBeastmaster extends DrawCard {
    static id = 'moto-beastmaster';

    setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onConflictDeclared: (event, context) => event.attackers?.includes(context.source) ?? false
            })
            .target({
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card, context) => context.player.firstPlayer ? card.costLessThan(5) : card.costLessThan(3)
            }, AbilityDsl.actions.putIntoConflict());
    }
}


export default MotoBeastmaster;
