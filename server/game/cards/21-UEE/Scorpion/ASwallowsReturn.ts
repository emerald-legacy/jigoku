import { Location, PlayType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

const CARD_COUNT = 3;

export default class ASwallowsReturn extends DrawCard {
    static id = 'a-swallow-s-return';

    setupCardAbilities() {
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: (context) =>
                context.game.currentConflict !== null &&
        context.player.opponent !== undefined &&
        context.player.opponent.conflictDeck.length >= CARD_COUNT,
            cost: AbilityDsl.costs.reveal((context) => context.player.opponent?.conflictDeck.slice(0, CARD_COUNT) ?? []),
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardMenu((context) => ({
                    activePromptTitle: 'Choose a card to play',
                    cards: context.costs.reveal,
                    cardCondition: (card) =>
                        card.location === Location.ConflictDeck &&
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
                        playType: PlayType.PlayFromHand,
                        source: context.source
                    }),
                    message: '{0} chooses to play {1} and discard {2}',
                    messageArgs: (card: any, player: any) => [player, card.name, context.costs.reveal.filter((c: any) => c !== card)]
                })),
                AbilityDsl.actions.discardCard((context) => ({
                    target: (context.costs.reveal ?? []).filter((card: any) => card.location === Location.ConflictDeck)
                }))
            ]),
            effect: 'choose one of those to play'
        });
    }
}
