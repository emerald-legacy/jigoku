import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { modifyGlory } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class HanteiSotorii extends DrawCard {
    static id = 'hantei-sotorii';

    setupCardAbilities() {
        this.action('Give a participating character +3 glory')
            .condition(context => context.source.isParticipating() && this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect(() => ({
                effect: modifyGlory(3)
            })))
            .chatText('give {0} +3 glory until the end of the conflict');
    }
}

export default HanteiSotorii;
