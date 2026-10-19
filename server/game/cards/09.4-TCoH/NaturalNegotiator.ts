import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { switchBaseSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';
import { canSwitchSkills } from '../switchSkills.js';

class NaturalNegotiator extends DrawCard {
    static id = 'natural-negotiator';

    override setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Courtier,
            myControl: true
        });

        this.action('Switch attached characters base skills')
            .condition((context) => context.game.isDuringConflict() &&
                !!context.source.parentCharacter && canSwitchSkills(context.source.parentCharacter))
            .cost(costs.giveHonorToOpponent())
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: switchBaseSkills()
            }))
            .chatText((context) => msg`switch ${context.source.parentCharacter}'s base ${'military'} and ${'political'} skill`);
    }
}


export default NaturalNegotiator;
