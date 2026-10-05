import DrawCard from '../../../DrawCard.js';
import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class RestorativeHotSpring extends DrawCard {
    static id = 'restorative-hot-spring';

    setupCardAbilities() {
        this.wouldInterrupt('Prevent a character from leaving play')
            .when({
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardType.Character && event.card.location === Location.PlayArea
            })
            .cost(AbilityDsl.costs.payFate(1))
            .gameAction(AbilityDsl.actions.cancel({
                replacementGameAction: AbilityDsl.actions.removeFromGame(context => ({ target: context.source }))
            }))
            .effect('prevent {1} from leaving play, removing itself from the game instead', context => context.event.card);
    }
}


export default RestorativeHotSpring;
