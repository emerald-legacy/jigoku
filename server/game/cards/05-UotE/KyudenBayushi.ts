import { msg } from '../../GameChat.js';
import { CardType, Duration, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect, ready } from '../../GameActions/GameActions.js';

export default class KyudenBayushi extends StrongholdCard {
    static id = 'kyuden-bayushi';

    setupCardAbilities() {
        this.action('Ready a dishonored character')
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isDishonored
            }, ready(), cardLastingEffect((context) => ({
                target: context.player.honor <= 6 ? context.target : [],
                duration: Duration.UntilEndOfPhase,
                effect: modifyBothSkills(1)
            })))
            .chatText((context) => msg`${context.target.bowed ? 'ready' : ''}${context.target.bowed && context.player.honor <= 6 ? ' and ' : ''}${context.player.honor <= 6 ? 'give +1/+1 until the end of phase to' : ''} ${context.chatTarget()}`);
    }
}
