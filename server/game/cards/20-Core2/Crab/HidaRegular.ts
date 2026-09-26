import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class HidaRegular extends DrawCard {
    static id = 'hida-regular';

    public setupCardAbilities() {
        this.interrupt('Remove fate from a character')
            .when({
                onCardLeavesPlay: ({ card }, context) =>
                    card === context.source && card.location === Location.PlayArea && card.isParticipating()
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.getMilitarySkill() <= context.source.getMilitarySkill()
            }, AbilityDsl.actions.removeFate());
    }
}
