import { CardType, Trait } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';

export default class KyudenIkoma extends StrongholdCard {
    static id = 'kyuden-ikoma';

    override setupCardAbilities() {
        this.reaction('Bow a non-champion')
            .when({
                afterConflict: (event, context) =>
                    // a character you control on the losing attacking side, whoever is the attacking player
                    event.conflict.loser === event.conflict.attackingPlayer &&
                    event.conflict.getAttackers().some((card) => card.controller === context.player)
            })
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.hasTrait(Trait.Champion),
                activePromptTitle: 'Bow a non-champion'
            }, bow())
            .chatText('bow {0}');
    }
}
