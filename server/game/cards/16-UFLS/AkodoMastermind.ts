import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Location, CardType, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AkodoMastermind extends DrawCard {
    static id = 'akodo-mastermind';

    setupCardAbilities() {
        this.action('Remove tactics to bow a character')
            .cost(AbilityDsl.costs.removeFromGame({
                cardType: [CardType.Event, CardType.Character, CardType.Attachment],
                location: Location.ConflictDiscardPile,
                mode: TargetMode.Unlimited,
                cardCondition: card => card.hasTrait('tactic')
            }))
            .condition(context => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.getGlory() <= this.getGloryCheck(context)
            }, AbilityDsl.actions.bow())
            .cannotTargetFirst();
    }

    getGloryCheck(context: AbilityContext) {
        if(context.costs.removeFromGame) {
            return (context.costs.removeFromGame as BaseCard[]).length;
        }
        return context.player.conflictDiscardPile.filter((card) => card.hasTrait('tactic')).length;
    }
}


export default AkodoMastermind;
