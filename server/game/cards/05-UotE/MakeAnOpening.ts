import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class MakeAnOpening extends DrawCard {
    static id = 'make-an-opening';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Give -X/-X to opposing character, where X is the difference between current honor dial bid values',
            condition: context => {
                const conflict = this.game.currentConflict;
                const opponent = context.player.opponent;
                return this.game.isDuringConflict() &&
                    !!opponent &&
                    !!conflict &&
                    conflict.getNumberOfParticipantsFor(context.player) >= 1 &&
                    conflict.getNumberOfParticipantsFor(opponent) >= 1 &&
                    !!context.player.showBid &&
                    !!opponent.showBid &&
                    context.player.showBid !== opponent.showBid;
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: any) =>
                    card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect((context: AbilityContext) => ({
                    effect: ability.effects.modifyBothSkills(-(this.getHonorDialDifference(context)))
                }))
            },
            effect: 'give {0} -{1}{2}/-{1}{3}',
            effectArgs: context => [this.getHonorDialDifference(context), 'military', 'political']
        });
    }

    getHonorDialDifference(context: AbilityContext) {
        const opp = context.player.opponent;
        if(!opp) {
            return 0;
        }
        return Math.abs((context.player.showBid ?? 0) - (opp.showBid ?? 0));
    }
}


export default MakeAnOpening;
