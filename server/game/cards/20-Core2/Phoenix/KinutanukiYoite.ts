import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class KinutanukiYoite extends DrawCard {
    static id = 'kinutanuki-yoite';

    setupCardAbilities() {
        this.reaction('Discard an enemy character')
            .when({
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    context.source.isParticipating() &&
                    (event.card).hasEveryTrait('fire', 'spell')
            })
            .target('target', {
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) =>
                    card.isParticipating() && card.militarySkill <= context.source.militarySkill
            }, AbilityDsl.actions.injure());
    }
}
