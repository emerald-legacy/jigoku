import { msg } from '../../GameChat.js';
import { CardType, Players, ConflictType } from '../../Constants.js';
import { atEndOfConflict, honor, sacrifice } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class InfernoGuardInvoker extends DrawCard {
    static id = 'inferno-guard-invoker';

    public override setupCardAbilities() {
        this.action('honor this character')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, honor(), atEndOfConflict((context) => {
                const conflict = context.game.currentConflict;
                return {
                    onlyIf: () => !!conflict && conflict.brokenProvinces.length > 0,
                    message: () => msg`${context.target} is discarded, burned to a pile of ash due to the delayed effect of ${context.source}`,
                    gameAction: sacrifice({ target: context.target })
                };
            }))
            .chatText('honor {0}. It will be discarded if a province is broken this conflict');
    }
}
