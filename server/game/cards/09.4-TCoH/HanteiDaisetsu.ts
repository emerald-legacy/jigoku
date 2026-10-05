import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, ConflictType } from '../../Constants.js';

class HanteiDaisetsu extends DrawCard {
    static id = 'hantei-daisetsu';

    setupCardAbilities() {
        this.action('Blank a participating character')
            .condition((context) => context.source.isParticipating() && context.game.isDuringConflict(ConflictType.Political))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.blank()
            }))
            .effect('treat {1} as if its text box were blank until the end of the conflict', (context) => [context.target]);
    }
}


export default HanteiDaisetsu;
