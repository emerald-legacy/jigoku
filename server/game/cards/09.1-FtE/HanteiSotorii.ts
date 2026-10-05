import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HanteiSotorii extends DrawCard {
    static id = 'hantei-sotorii';

    setupCardAbilities() {
        this.action('Give a participating character +3 glory')
            .condition(context => context.source.isParticipating() && this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect(() => ({
                effect: AbilityDsl.effects.modifyGlory(3)
            })))
            .effect('give {0} +3 glory until the end of the conflict');
    }
}

export default HanteiSotorii;
