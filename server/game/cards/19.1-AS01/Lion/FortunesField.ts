import { CardType, Duration } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';

export default class FortunesField extends ProvinceCard {
    static id = 'fortune-s-field';

    public setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player && event.card.type === CardType.Character
            },
            title: 'Reduce cost of next character or follower by 1',
            effect: 'reduce the cost of their next character or follower this round by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfRound,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card: BaseCard) => card.type === CardType.Character || card.hasTrait('follower')
                )
            }))
        });
    }
}
