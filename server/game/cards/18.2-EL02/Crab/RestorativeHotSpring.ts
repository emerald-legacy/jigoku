import DrawCard from '../../../DrawCard.js';
import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class RestorativeHotSpring extends DrawCard {
    static id = 'restorative-hot-spring';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            cost: AbilityDsl.costs.payFate(1),
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardType.Character && event.card.location === Location.PlayArea
            },
            effect: 'prevent {1} from leaving play, removing itself from the game instead',
            effectArgs: context => context.event.card as DrawCard,
            gameAction: AbilityDsl.actions.cancel({
                replacementGameAction: AbilityDsl.actions.removeFromGame(context => ({ target: context.source }))
            })
        });
    }
}


export default RestorativeHotSpring;
