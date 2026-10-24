import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';

class SettingTheStandard extends DrawCard {
    static id = 'setting-the-standard';

    override setupCardAbilities() {
        this.whileAttached({
            effect: gainAbility.reaction('Draw 2 cards and discard one', (ability) => ability
                .when({
                    afterConflict: (event, context) =>
                        event.conflict.isOnWinningSide(context.source)
                })
                .draw(2)
                .chatText('draw 2 cards, then discard 1')
                .then()
                .chosenDiscard((context) => ({ target: context.player })))
        });
    }
}


export default SettingTheStandard;
