import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class Castigated extends DrawCard {
    static id = 'castigated';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.delayedEffect({
                condition: context => context.source.parent && !context.source.parent.hasDash('political') && context.source.parent.getPoliticalSkill() < 1,
                message: '{0} is discarded by {1}',
                messageArgs: context => [context.source.parent, context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });
    }

    canPlayOn(card) {
        return card.isParticipating() && super.canPlayOn(card);
    }

    canPlay(context, playType) {
        if(!context.game.isDuringConflict('political') || !context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && card.hasTrait('imperial'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default Castigated;
