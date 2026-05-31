import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Locations, CardTypes, TargetModes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AkodoMastermind extends DrawCard {
    static id = 'akodo-mastermind';

    setupCardAbilities() {
        this.action({
            title: 'Remove tactics to bow a character',
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.removeFromGame({
                cardType: [CardTypes.Event, CardTypes.Character, CardTypes.Attachment],
                location: Locations.ConflictDiscardPile,
                mode: TargetModes.Unlimited,
                cardCondition: card => card.hasTrait('tactic')
            }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card.getGlory() <= this.getGloryCheck(context),
                gameAction: AbilityDsl.actions.bow()
            },
            cannotTargetFirst: true
        });
    }

    getGloryCheck(context: AbilityContext) {
        if(context.costs.removeFromGame) {
            return (context.costs.removeFromGame as BaseCard[]).length;
        }
        return context.player.conflictDiscardPile.filter((card: any) => card.hasTrait('tactic')).length;
    }
}


export default AkodoMastermind;
