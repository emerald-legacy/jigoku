import DrawCard from '../../../drawcard.js';
import { CardTypes, Locations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class RestorativeHotSpring extends DrawCard {
    static id = 'restorative-hot-spring';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            cost: AbilityDsl.costs.payFate(1),
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === CardTypes.Character && event.card.location === Locations.PlayArea
            },
            effect: 'prevent {1} from leaving play, removing itself from the game instead',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel({
                replacementGameAction: AbilityDsl.actions.removeFromGame(context => ({ target: context.source }))
            })
        });
    }
}


export default RestorativeHotSpring;
