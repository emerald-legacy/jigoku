import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class StrengthInNumbers extends DrawCard {
    static id = 'strength-in-numbers';

    setupCardAbilities(ability) {
        this.action({
            title: 'Send home defending character',
            condition: context => context.player.isAttackingPlayer(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card =>
                    card.isDefending() &&
                    card.getGlory() <= this.game.currentConflict.getNumberOfParticipantsFor('attacker'),
                gameAction: ability.actions.sendHome()
            },
            cannotBeMirrored: true
        });
    }
}


export default StrengthInNumbers;
