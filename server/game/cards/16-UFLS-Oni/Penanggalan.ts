import { CardType, Players } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class Penanggalan extends BaseOni {
    static id = 'penanggalan';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Move a fate onto this character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isTainted && card.isParticipating()
            }, placeFate((context) => ({
                target: context.source,
                origin: context.target
            })))
            .chatText((context) => msg`take a fate from ${context.target} and place it on ${context.source}`);
    }
}
