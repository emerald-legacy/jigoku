import { gainAbility } from '../../../effects.js';
import { bow, multiple, sendHome } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class DragonsClaw extends DrawCard {
    static id = 'dragon-s-claw';

    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.attachments.some((a) => a.name === 'Dragon\'s Fang'),
            effect: gainAbility.action('Bow and send home a participating character with lower military skill', (ability) => ability
                .condition((context) => context.source.isParticipating())
                .target({
                    cardType: CardType.Character,
                    controller: Players.Any,
                    cardCondition: (card, context) =>
                        card.isParticipating() && card.militarySkill < context.source.militarySkill
                }, multiple([bow(), sendHome()])))
        });
    }
}
