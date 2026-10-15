import { CardType, Players, Trait } from '../../../Constants.js';
import { injure } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class KinutanukiYoite extends DrawCard {
    static id = 'kinutanuki-yoite';

    override setupCardAbilities() {
        this.reaction('Discard an enemy character')
            .when({
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    context.source.isParticipating() &&
                    event.card.hasEveryTrait(Trait.Fire, Trait.Spell)
            })
            .target({
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.militarySkill <= context.source.militarySkill
            }, injure());
    }
}
