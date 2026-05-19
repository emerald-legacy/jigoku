import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes, TargetModes } from '../../Constants.js';

class Untainted extends DrawCard {
    static id = 'untainted';

    setupCardAbilities() {
        this.reaction({
            title: 'discard status token',
            when: {
                afterConflict: (event, context) => context.source.parent &&
                    event.conflict.winner === context.player
                    && context.source.parent.isConflictProvince()
            },
            target: {
                activePromptTitle: 'Choose a status token',
                mode: TargetModes.Token,
                location: Locations.Any,
                tokenCondition: (token, context) => {
                    return token.card === context.source.parent || token.card.isParticipating();
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardStatusToken(context => ({
                    target: context.token
                })),
                AbilityDsl.actions.gainHonor(context => ({
                    target: context.player
                }))
            ]),
            effect: 'gain 1 honor and discard {1} from {2}',
            effectArgs: context => [context.token, Array.isArray(context.token) ? context.token[0].card : context.token.card]
        });
    }

    canPlayOn(source) {
        return source && source.getType() === 'province' && !source.isBroken && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent) {
        if(parent.type === CardTypes.Province && parent.isBroken) {
            return false;
        }

        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}


export default Untainted;
