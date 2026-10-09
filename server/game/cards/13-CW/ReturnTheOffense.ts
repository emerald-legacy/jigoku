import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { cardCannot, doesNotBow } from '../../effects.js';
import { cardLastingEffect, multiple } from '../../GameActions/GameActions.js';
import { DuelType, RestrictionType } from '../../Constants.js';

class ReturnTheOffense extends DrawCard {
    static id = 'return-the-offense';

    setupCardAbilities() {
        this.action('Initiate a political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                chatText: (_context, duel) => msg`${duel.winner}${duel.winner?.length ? ' does not bow as a result of conflict resolution' : ''}${duel.loser?.length ? ' and ' : ''}${duel.loser}${duel.loser?.length ? ' cannot be readied' : ''}`,
                gameAction: (duel) => multiple([
                    cardLastingEffect({
                        target: duel.winner,
                        effect: doesNotBow()
                    }),
                    cardLastingEffect({
                        target: duel.loser,
                        effect: cardCannot({
                            cannot: RestrictionType.Ready,
                            restricts: 'cardEffects'
                        })
                    })
                ])
            }));
    }
}


export default ReturnTheOffense;
