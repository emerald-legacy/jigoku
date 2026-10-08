import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { placeFate, selectCard } from '../../GameActions/GameActions.js';

export default class SharingShinseisWisdom extends ProvinceCard {
    static id = 'sharing-shinsei-s-wisdom';

    setupCardAbilities() {
        this.reaction('Move 1 fate to another character')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, selectCard((context) => ({
                activePromptTitle: 'Choose a character to receive a fate',
                cardType: CardType.Character,
                controller: context.target.controller === context.player ? Players.Self : Players.Opponent,
                cardCondition: (card, context) => card !== context.target,
                message: '{0} moves 1 fate from {1} to {2}',
                messageArgs: (card) => [context.player, context.target, card],
                gameAction: placeFate({
                    origin: context.target
                })
            })))
            .chatText('move 1 fate from {0} to another character');
    }
}
