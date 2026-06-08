import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Location, TargetMode } from '../../Constants.js';
import type { StatusToken } from '../../StatusToken.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import type Ring from '../../Ring.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

class Untainted extends DrawCard {
    static id = 'untainted';

    setupCardAbilities() {
        this.reaction({
            title: 'discard status token',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) => !!context.source.parent &&
                    event.conflict.winner === context.player
                    && context.source.parent.isConflictProvince()
            },
            target: {
                activePromptTitle: 'Choose a status token',
                mode: TargetMode.Token,
                location: Location.Any,
                tokenCondition: (token: StatusToken, context?: AbilityContext) => {
                    const parent = context && (context.source as DrawCard).parent;
                    return !!token.card && (token.card === parent || (token.card instanceof DrawCard && token.card.isParticipating()));
                }
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardStatusToken((context: AbilityContext) => ({
                    target: context.token
                })),
                AbilityDsl.actions.gainHonor((context: AbilityContext) => ({
                    target: context.player
                }))
            ]),
            effect: 'gain 1 honor and discard {1} from {2}',
            effectArgs: (context) => {
                const token = context?.token as StatusToken | StatusToken[] | undefined;
                if(!token) {
                    return [];
                }
                const card = Array.isArray(token) ? token[0].card : token.card;
                return card ? [token, card] : [];
            }
        });
    }

    canPlayOn(source: BaseCard | Ring) {
        return source instanceof ProvinceCard && !source.isBroken && this.getType() === CardType.Attachment;
    }

    canAttach(parent: BaseCard | Ring) {
        if(parent instanceof ProvinceCard && parent.isBroken) {
            return false;
        }

        return parent instanceof ProvinceCard && this.getType() === CardType.Attachment;
    }
}


export default Untainted;
