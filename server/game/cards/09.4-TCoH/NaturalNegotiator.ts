import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration } from '../../Constants.js';

class NaturalNegotiator extends DrawCard {
    static id = 'natural-negotiator';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier',
            myControl: true
        });

        this.action({
            title: 'Switch attached characters base skills',
            effect: 'switch {1}\'s base {2} and {3} skill',
            effectArgs: (context: AbilityContext) => [(context.source as DrawCard).parent as DrawCard, 'military', 'political'],
            cost: AbilityDsl.costs.giveHonorToOpponent(),
            condition: (context) => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfConflict,
                target: context.source.parent,
                effect: AbilityDsl.effects.switchBaseSkills()
            }))
        });
    }
}


export default NaturalNegotiator;
