import { CardType, Players } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import { placeFate } from '../../GameActions/GameActions.js';

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
            .effect('take a fate from {1} and place it on {2}', (context) => [context.target, context.source]);
    }
}
