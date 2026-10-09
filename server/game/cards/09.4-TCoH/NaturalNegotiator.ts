import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { switchBaseSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class NaturalNegotiator extends DrawCard {
    static id = 'natural-negotiator';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier',
            myControl: true
        });

        this.action('Switch attached characters base skills')
            .cost(costs.giveHonorToOpponent())
            .condition((context) => context.game.isDuringConflict())
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: switchBaseSkills()
            }))
            .chatText((context) => msg`switch ${context.source.parentCharacter}'s base ${'military'} and ${'political'} skill`);
    }
}


export default NaturalNegotiator;
