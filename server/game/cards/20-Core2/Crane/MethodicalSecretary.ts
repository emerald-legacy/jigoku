import { CardType } from '../../../Constants.js';
import { ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MethodicalSecretary extends DrawCard {
    static id = 'methodical-secretary';

    setupCardAbilities() {
        this.interrupt('Ready for Glory Count')
            .when({
                onGloryCount: () => true
            })
            .target({
                cardType: CardType.Character
            }, ready());
    }
}
