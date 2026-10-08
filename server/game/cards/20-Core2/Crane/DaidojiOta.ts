import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { reduceCost } from '../../../effects.js';
import { chosenDiscard, lookAt } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiOta extends DrawCard {
    static id = 'daidoji-ota';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) =>
                context.player.cardsInPlay.some(
                    (card) => card.getType() === CardType.Character && card.isParticipating()
                ),
            effect: reduceCost({
                amount: (card, player) => {
                    const dynastyMatchesByName = player.dynastyDiscardPile.filter((a) => a.name === card.name);
                    const conflictMatchesByName = player.conflictDiscardPile.filter((a) => a.name === card.name);
                    if(dynastyMatchesByName.length + conflictMatchesByName.length > 0) {
                        return -1;
                    }
                    return 0;
                },
                match: (card) => card.type === CardType.Event
            })
        });

        this.conflictAction('Have opponent discard a card or show you their hand')
            .select({
                player: Players.Opponent
            }, {
                'Discard an event': chosenDiscard({
                    cardCondition: (card) => card.type === CardType.Event
                }),
                'Reveal your hand': lookAt((context) => ({
                    target: context.player.opponent?.hand.slice().sort((a, b) => a.name.localeCompare(b.name)),
                    chatMessage: true,
                    message: (context, cards) => msg`${context.player.opponent} reveals their hand: ${cards}`
                }))
            })
            .chatText('make {1}{2}', (context) =>
                context.select === 'Discard an event'
                    ? [context.player.opponent, ' discard an event']
                    : [context.player.opponent, ' reveal their hand']);
    }
}
