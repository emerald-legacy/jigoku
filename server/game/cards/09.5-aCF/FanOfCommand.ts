import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FanOfCommand extends DrawCard {
    static id = 'fan-of-command';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            condition: context => !!(context.source.parent && context.source.parent.isParticipating()),
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating() && card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}


export default FanOfCommand;
