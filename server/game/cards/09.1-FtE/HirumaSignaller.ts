import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class HirumaSignaller extends DrawCard {
    static id = 'hiruma-signaller';

    setupCardAbilities() {
        this.action('Sacrifice this card to ready and move a character to the conflict')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => context.source.isDefending())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready(),
                AbilityDsl.actions.moveToConflict()
            ]))
            .effect('ready and move {0} to the conflict');
    }
}


export default HirumaSignaller;

