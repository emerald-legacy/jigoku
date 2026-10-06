import DrawCard from '../../DrawCard.js';
import { discardStatusToken, gainHonor, multiple } from '../../GameActions/GameActions.js';
import { Location } from '../../Constants.js';
import { ProvinceAttachment } from '../ProvinceAttachment.js';

class Untainted extends ProvinceAttachment {
    static id = 'untainted';

    setupCardAbilities() {
        this.reaction('discard status token')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                    !!context.source.parentProvince?.isConflictProvince()
            })
            .tokenTarget({
                activePromptTitle: 'Choose a status token',
                location: Location.Any,
                tokenCondition: (token, context) => {
                    const parent = context && context.source.parent;
                    return !!token.card && (token.card === parent || (token.card instanceof DrawCard && token.card.isParticipating()));
                }
            })
            .gameAction(multiple([
                discardStatusToken((context) => ({
                    target: context.token
                })),
                gainHonor((context) => ({
                    target: context.player
                }))
            ]))
            .effect('gain 1 honor and discard {1} from {2}', (context) => {
                const card = context.token[0].card;
                return card ? [context.token, card] : [];
            });
    }
}


export default Untainted;
