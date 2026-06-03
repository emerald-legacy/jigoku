import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class RespectedConnoisseur extends DrawCard {
    static id = 'respected-connoisseur';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            condition: (context) => context.source.isHonored,
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source && card.isParticipating() === context.source.isParticipating(),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}
