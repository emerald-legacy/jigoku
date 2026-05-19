import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class MethodicalSecretary extends DrawCard {
    static id = 'methodical-secretary';

    setupCardAbilities() {
        this.interrupt({
            title: 'Ready for Glory Count',
            when: {
                onGloryCount: () => true
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}
