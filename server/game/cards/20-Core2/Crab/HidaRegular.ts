import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class HidaRegular extends DrawCard {
    static id = 'hida-regular';

    public setupCardAbilities() {
        this.interrupt({
            title: 'Remove fate from a character',
            when: {
                onCardLeavesPlay: ({ card }, context) =>
                    card === context.source && card.location === Location.PlayArea && (card as DrawCard).isParticipating()
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.getMilitarySkill() <= context.source.getMilitarySkill(),
                gameAction: AbilityDsl.actions.removeFate()
            }
        });
    }
}
