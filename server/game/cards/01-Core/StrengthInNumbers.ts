import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { sendHome } from '../../GameActions/GameActions.js';

class StrengthInNumbers extends DrawCard {
    static id = 'strength-in-numbers';

    setupCardAbilities() {
        this.action('Send home defending character')
            .condition((context) => context.player.isAttackingPlayer())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) =>
                    card.isDefending() &&
                    card.glory <= (this.game.currentConflict?.getNumberOfParticipantsFor('attacker') ?? 0)
            }, sendHome())
            .cannotBeMirrored();
    }
}


export default StrengthInNumbers;
