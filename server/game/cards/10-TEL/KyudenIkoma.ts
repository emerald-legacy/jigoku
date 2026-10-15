import { CardType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';

export default class KyudenIkoma extends StrongholdCard {
    static id = 'kyuden-ikoma';

    setupCardAbilities() {
        this.reaction('Bow a non-champion')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player &&
                    event.conflict.defendingPlayer !== context.player &&
                    event.conflict.getAttackers().length !== 0
            })
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.hasTrait('champion'),
                activePromptTitle: 'Bow a non-champion'
            }, bow())
            .chatText('bow {0}');
    }
}
