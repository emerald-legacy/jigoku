import { CardTypes, Players, TargetModes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class DaidojiOta extends DrawCard {
    static id = 'daidoji-ota';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) =>
                context.player.cardsInPlay.some(
                    (card) => card.getType() === CardTypes.Character && card.isParticipating()
                ),
            effect: AbilityDsl.effects.reduceCost({
                amount: (card: any, player: any) => {
                    const dynastyMatchesByName = player.dynastyDiscardPile.filter((a: any) => a.name === card.name);
                    const conflictMatchesByName = player.conflictDiscardPile.filter((a: any) => a.name === card.name);
                    if(dynastyMatchesByName.length + conflictMatchesByName.length > 0) {
                        return -1;
                    }
                    return 0;
                },
                match: (card: any) => card.type === CardTypes.Event
            })
        });

        this.action({
            title: 'Have opponent discard a card or show you their hand',
            condition: (context) => context.source.isParticipating(),
            target: {
                player: Players.Opponent,
                mode: TargetModes.Select,
                choices: {
                    'Discard an event': AbilityDsl.actions.chosenDiscard({
                        cardCondition: (card) => card.type === CardTypes.Event
                    }),
                    'Reveal your hand': AbilityDsl.actions.lookAt((context) => ({
                        target: context.player.opponent.hand.slice().sort((a: any, b: any) => a.name.localeCompare(b.name)),
                        chatMessage: true,
                        message: '{0} reveals their hand: {1}',
                        messageArgs: (cards: any) => [context.player.opponent, cards]
                    }))
                }
            },
            effect: 'make {1}{2}',
            effectArgs: (context): [any, string] =>
                context.select === 'Discard an event'
                    ? [context.player.opponent, ' discard an event']
                    : [context.player.opponent, ' reveal their hand']
        });
    }
}
