import AbilityDsl from '../../../abilitydsl';
import { Locations, PlayTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class ASwallowsReturn extends DrawCard {
    static id = 'a-swallow-s-return';

    setupCardAbilities() {
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: (context) =>
                context.game.currentConflict != null &&
                context.player.opponent != null &&
                context.player.opponent.conflictDeck.size() >= 4,
            cost: AbilityDsl.costs.reveal((context) => context.player.opponent.conflictDeck.first(4)),
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to play',
                    cards: context.costs.reveal,
                    cardCondition: (card) =>
                        card.location === Locations.ConflictDeck &&
                        //Handle situations where card is played from deck, such as with pillow book
                        card.uuid !== context.source.uuid,
                    choices: ['Play nothing'],
                    handlers: [
                        () => {
                            this.game.addMessage('{0} takes nothing', context.player);
                            return true;
                        }
                    ],
                    gameAction: AbilityDsl.actions.playCard({
                        playType: PlayTypes.PlayFromHand,
                        source: context.source
                    }),
                    message: '{0} chooses to play {1} and discard {2}',
                    messageArgs: (card, player) => [player, card.name, context.costs.reveal.filter((c) => c !== card)]
                })),
                AbilityDsl.actions.discardCard((context) => ({
                    target: (context.costs.reveal ?? []).filter((card) => card.location === Locations.ConflictDeck)
                }))
            ]),
            effect: 'choose one of those to play'
        });
    }
}
