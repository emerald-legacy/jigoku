import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class MakeAnOpening extends DrawCard {
    static id = 'make-an-opening';

    setupCardAbilities(ability) {
        this.action({
            title: 'Give -X/-X to opposing character, where X is the difference between current honor dial bid values',
            condition: context =>
                this.game.isDuringConflict() &&
                context.player.opponent &&
                this.game.currentConflict.getNumberOfParticipantsFor(context.player) >= 1 &&
                this.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) >= 1 &&
                context.player.showBid &&
                context.player.opponent.showBid &&
                context.player.showBid !== context.player.opponent.showBid,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card =>
                    card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyBothSkills(-(this.getHonorDialDifference(context)))
                }))
            },
            effect: 'give {0} -{1}{2}/-{1}{3}',
            effectArgs: context => [this.getHonorDialDifference(context), 'military', 'political']
        });
    }

    getHonorDialDifference(context) {
        return Math.abs(context.player.showBid - context.player.opponent.showBid);
    }
}


export default MakeAnOpening;
