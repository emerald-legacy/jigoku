import DrawCard from '../../DrawCard.js';
import { blank } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../Constants.js';

class HanteiDaisetsu extends DrawCard {
    static id = 'hantei-daisetsu';

    setupCardAbilities() {
        this.action('Blank a participating character')
            .condition((context) => context.source.isParticipating() && context.game.isDuringConflict(ConflictType.Political))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({
                effect: blank()
            }))
            .effect('treat {1} as if its text box were blank until the end of the conflict', (context) => [context.target]);
    }
}


export default HanteiDaisetsu;
