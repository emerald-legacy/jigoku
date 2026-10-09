import { cardCannot, doesNotBow } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { RestrictionType, RestrictionScope } from '../../../Constants.js';

export default class MasterOfTheBlade extends DrawCard {
    static id = 'master-of-the-blade';

    public setupCardAbilities() {
        this.duelStrike('Don\'t bow during resolution', (duel, context) => duel.participants.includes(context.source))
            .cardLastingEffect((context) => ({
                condition: (context) => context.game.isDuringConflict(),
                effect: [
                    doesNotBow(),
                    cardCannot({
                        cannot: RestrictionType.Bow,
                        appliesTo: RestrictionScope.OpponentsCardEffects,
                        applyingPlayer: context.player
                    })
                ]
            }))
            .chatText('prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict');
    }
}
