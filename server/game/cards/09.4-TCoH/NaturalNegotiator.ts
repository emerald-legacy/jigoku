import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { switchBaseSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

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
            .gameAction(cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: switchBaseSkills()
            })))
            .effect('switch {1}\'s base {2} and {3} skill', (context) => [context.source.parentCharacter, 'military', 'political']);
    }
}


export default NaturalNegotiator;
