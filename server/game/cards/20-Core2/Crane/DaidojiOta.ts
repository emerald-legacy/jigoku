import { CardType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

export default class DaidojiOta extends DrawCard {
    static id = 'daidoji-ota';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) =>
                context.player.cardsInPlay.some(
                    (card) => card.getType() === CardType.Character && card.isParticipating()
                ),
            effect: AbilityDsl.effects.reduceCost({
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

        this.action({
            title: 'Have opponent discard a card or show you their hand',
            condition: (context) => context.source.isParticipating(),
            target: {
                player: Players.Opponent,
                mode: TargetMode.Select,
                choices: {
                    'Discard an event': AbilityDsl.actions.chosenDiscard({
                        cardCondition: (card) => card.type === CardType.Event
                    }),
                    'Reveal your hand': AbilityDsl.actions.lookAt((context) => ({
                        target: context.player.opponent.hand.slice().sort((a: DrawCard, b: DrawCard) => a.name.localeCompare(b.name)),
                        chatMessage: true,
                        message: '{0} reveals their hand: {1}',
                        messageArgs: (cards) => [context.player.opponent, cards]
                    }))
                }
            },
            effect: 'make {1}{2}',
            effectArgs: (context): [Player, string] =>
                context.select === 'Discard an event'
                    ? [context.player.opponent as Player, ' discard an event']
                    : [context.player.opponent as Player, ' reveal their hand']
        });
    }
}
