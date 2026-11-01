import { CardType, Location } from '../../../Constants.js';
import { removeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class HidaRegular extends DrawCard {
    static id = 'hida-regular';

    public override setupCardAbilities() {
        this.interrupt('Remove fate from a character')
            .when({
                onCardLeavesPlay: ({ card }, context) =>
                    card === context.source && card.location === Location.PlayArea && card.isParticipating()
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card !== context.source && card.isParticipating() && card.militarySkill <= context.source.militarySkill
            }, removeFate());
    }
}
