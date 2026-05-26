import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StrengthInNumbers extends DrawCard {
    static id = 'strength-in-numbers';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Send home defending character',
            condition: context => context.player.isAttackingPlayer(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) =>
                    card.isDefending() &&
                    card.getGlory() <= (this.game.currentConflict?.getNumberOfParticipantsFor('attacker') ?? 0),
                gameAction: ability.actions.sendHome()
            },
            cannotBeMirrored: true
        });
    }
}


export default StrengthInNumbers;
