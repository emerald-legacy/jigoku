import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ExposedSecrets extends DrawCard {
    static id = 'exposed-secrets';

    setupCardAbilities() {
        this.action('Bow attacking character')
            .condition(context => context.game.isDuringConflict('political'))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating() && card.getPoliticalSkill() <= card.controller.showBid
            }, AbilityDsl.actions.bow());
    }
}


export default ExposedSecrets;
