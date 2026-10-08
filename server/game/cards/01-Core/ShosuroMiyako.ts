import { CardType, PlayType, Players } from '../../Constants.js';
import { discardAtRandom, dishonor, selectCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

export default class ShosuroMiyako extends DrawCard {
    static id = 'shosuro-miyako';

    public setupCardAbilities() {
        this.reaction('Opponent discards or dishonors')
            .when({
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    event.playType === PlayType.PlayFromHand &&
                    event.card.type === CardType.Character &&
                    context.player.opponent !== undefined
            })
            .select({
                player: Players.Opponent
            }, {
                'Discard at random': discardAtRandom(),
                'Dishonor a character': selectCard((context) => ({
                    activePromptTitle: 'Choose a character to dishonor',
                    player: Players.Opponent,
                    controller: Players.Opponent,
                    targets: true,
                    message: '{0} chooses to dishonor {1}',
                    messageArgs: (card) => [context.player.opponent, card],
                    gameAction: dishonor()
                }))
            })
            .chatText((context) => msg`force ${context.player.opponent ?? ''} to ${context.select.toLowerCase()}`);
    }
}
