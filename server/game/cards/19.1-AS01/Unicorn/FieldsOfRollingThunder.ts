import { msg } from '../../../GameChat.js';
import { atEndOfConflict, dishonor, honor, multiple } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class FieldsOfRollingThunder extends DrawCard {
    static id = 'fields-of-rolling-thunder';

    public override setupCardAbilities() {
        this.forcedReaction('Discard this holding')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player && event.conflict.conflictUnopposed
            })
            .discardFromPlay();

        this.action('Honor a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.isFaction('unicorn')
            }, multiple([
                honor(),
                atEndOfConflict((context) => {
                    const conflict = context.game.currentConflict;
                    return {
                        onlyIf: (context) => conflict?.winner === context.player.opponent,
                        gameAction: dishonor({ target: context.target })
                    };
                })
            ]))
            .chatText((context) => msg`honor ${context.chatTarget()}. They will be dishonored at the end of the conflict if ${context.source.controller} loses the conflict`);
    }
}
