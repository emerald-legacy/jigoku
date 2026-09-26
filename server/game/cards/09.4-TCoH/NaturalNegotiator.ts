import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration } from '../../Constants.js';

class NaturalNegotiator extends DrawCard {
    static id = 'natural-negotiator';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier',
            myControl: true
        });

        this.action('Switch attached characters base skills')
            .cost(AbilityDsl.costs.giveHonorToOpponent())
            .condition((context) => context.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfConflict,
                target: context.source.parentCharacter ?? [],
                effect: AbilityDsl.effects.switchBaseSkills()
            })))
            .effect('switch {1}\'s base {2} and {3} skill', (context) => [context.source.parentCharacter, 'military', 'political']);
    }
}


export default NaturalNegotiator;
