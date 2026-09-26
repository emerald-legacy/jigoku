import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Location } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import type Ring from '../../Ring.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

class Untainted extends DrawCard {
    static id = 'untainted';

    setupCardAbilities() {
        this.reaction('discard status token')
            .when({
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) => event.conflict.winner === context.player &&
                    !!context.source.parentProvince?.isConflictProvince()
            })
            .tokenTarget('target', {
                activePromptTitle: 'Choose a status token',
                location: Location.Any,
                tokenCondition: (token, context) => {
                    const parent = context && context.source.parent;
                    return !!token.card && (token.card === parent || (token.card instanceof DrawCard && token.card.isParticipating()));
                }
            })
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardStatusToken((context) => ({
                    target: context.token
                })),
                AbilityDsl.actions.gainHonor((context) => ({
                    target: context.player
                }))
            ]))
            .effect('gain 1 honor and discard {1} from {2}', (context) => {
                const card = context.token[0].card;
                return card ? [context.token, card] : [];
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
