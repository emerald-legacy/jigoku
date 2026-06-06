import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class KinutanukiYoite extends DrawCard {
    static id = 'kinutanuki-yoite';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard an enemy character',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    context.source.isParticipating() &&
                    (event.card as DrawCard).hasEveryTrait('fire', 'spell')
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: DrawCard, context) =>
                    card.isParticipating() && card.militarySkill <= context.source.militarySkill,
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => (context.target as DrawCard).getFate() === 0,
                    trueGameAction: AbilityDsl.actions.discardFromPlay(),
                    falseGameAction: AbilityDsl.actions.removeFate()
                })
            }
        });
    }
}
