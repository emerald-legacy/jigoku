import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class HirumaAmbusher extends DrawCard {
    static id = 'hiruma-ambusher';

    setupCardAbilities() {
        this.reaction('Disable a character')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.isDefending()
            })
            .target({
                cardType: CardType.Character
            }, cardLastingEffect({
                effect: cannotTriggerAbilities()
            }))
            .effect('prevent {0} from using any abilities');
    }
}


export default HirumaAmbusher;
