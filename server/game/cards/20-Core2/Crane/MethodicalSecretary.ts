import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class MethodicalSecretary extends DrawCard {
    static id = 'methodical-secretary';

    setupCardAbilities() {
        this.interrupt('Ready for Glory Count')
            .when({
                onGloryCount: () => true
            })
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.ready());
    }
}
