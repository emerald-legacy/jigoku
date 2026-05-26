import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, EventNames, Locations, TargetModes } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Untainted extends DrawCard {
    static id = 'untainted';

    setupCardAbilities() {
        this.reaction({
            title: 'discard status token',
            when: {
                afterConflict: (event: EventPayload<EventNames.AfterConflict>, context) => !!context.source.parent &&
                    event.conflict.winner === context.player
                    && context.source.parent.isConflictProvince()
            },
            target: {
                activePromptTitle: 'Choose a status token',
                mode: TargetModes.Token,
                location: Locations.Any,
                tokenCondition: (token: any, context: any) => {
                    return !!token.card && (token.card === context.source.parent || token.card.isParticipating());
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardStatusToken((context: any) => ({
                    target: context.token
                })),
                AbilityDsl.actions.gainHonor((context: any) => ({
                    target: context.player
                }))
            ]),
            effect: 'gain 1 honor and discard {1} from {2}',
            effectArgs: context => {
                const token: any = context && (context as any).token;
                if(!token) {
                    return [];
                }
                return [token, Array.isArray(token) ? token[0].card : token.card];
            }
        });
    }

    canPlayOn(source: any) {
        return source && source.getType() === 'province' && !source.isBroken && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent: any) {
        if(parent.type === CardTypes.Province && parent.isBroken) {
            return false;
        }

        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}


export default Untainted;
