import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { chosenDiscard, draw, sequential } from '../../GameActions/GameActions.js';

class SettingTheStandard extends DrawCard {
    static id = 'setting-the-standard';

    override setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Draw 2 cards and discard one', (ability) => ability
                .when({
                    afterConflict: (event, context) =>
                        event.conflict.isOnWinningSide(context.source)
                })
                .gameAction(sequential([
                    draw((context) => ({ target: context.player, amount: 2 })),
                    chosenDiscard((context) => ({ target: context.player }))
                ]))
                .chatText('draw 2 cards, then discard 1'))
        });
    }
}


export default SettingTheStandard;
