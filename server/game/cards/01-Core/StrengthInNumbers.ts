import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StrengthInNumbers extends DrawCard {
    static id = 'strength-in-numbers';

    setupCardAbilities() {
        this.action('Send home defending character')
            .condition(context => context.player.isAttackingPlayer())
            .target({
                cardType: CardType.Character,
                cardCondition: card =>
                    card.isDefending() &&
                    card.getGlory() <= (this.game.currentConflict?.getNumberOfParticipantsFor('attacker') ?? 0)
            }, AbilityDsl.actions.sendHome())
            .cannotBeMirrored();
    }
}


export default StrengthInNumbers;
