import { cardCannot, doesNotBow } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MasterOfTheBlade extends DrawCard {
    static id = 'master-of-the-blade';

    public setupCardAbilities() {
        this.duelStrike('Don\'t bow during resolution', (duel, context) => duel.participants.includes(context.source))
            .gameAction(cardLastingEffect((context) => ({
                condition: (context) => context.game.isDuringConflict(),
                effect: [
                    doesNotBow(),
                    cardCannot({
                        cannot: 'bow',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                ]
            })))
            .effect('prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict');
    }
}
