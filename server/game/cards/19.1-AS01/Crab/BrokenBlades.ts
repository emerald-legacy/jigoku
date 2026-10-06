import AbilityDsl from '../../../abilitydsl.js';
import { discardFromPlay, removeFate, sequential } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class BrokenBlades extends DrawCard {
    static id = 'broken-blades';

    public setupCardAbilities() {
        this.reaction('Return all fate from a character then discard them')
            .when({
                afterConflict: (event, context) =>
                    context.player.isAttackingPlayer() &&
                    event.conflict.winner === context.player &&
                    event.conflict.conflictType === ConflictType.Military
            })
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('berserker')
            }))
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, sequential([
                removeFate((context) => ({
                    amount: context.target.getFate(),
                    recipient: context.target.owner
                })),
                discardFromPlay()
            ]))
            .effect('ensure {0} is gone!{1}{2}{3}', (context) => {
                const target = context.target;
                return target.fate < 1
                    ? []
                    : [' (', target.owner, ' recovers ' + target.fate + ' fate)'];
            })
            .max(AbilityDsl.limit.perConflict(1));
    }
}
