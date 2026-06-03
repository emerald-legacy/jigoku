import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ExcellenceAttained extends ProvinceCard {
    static id = 'excellence-attained';

    setupCardAbilities() {
        this.reaction({
            title: 'Search for an attachment',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source && context.player.conflictDeck.length > 0
            },
            effect: 'search the top 5 cards of their conflict deck for an attachment and put it into play',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardMenu((context) => ({
                    activePromptTitle: 'Choose an attachment',
                    cards: context.player.conflictDeck.slice(0, 5),
                    cardCondition: (card) => card.type === CardType.Attachment && (card.printedCost ?? 0) <= 1,
                    choices: ['Take nothing'],
                    handlers: [
                        () => {
                            this.game.addMessage('{0} takes nothing', context.player);
                            return true;
                        }
                    ],
                    subActionProperties: (card) => ({ attachment: card }),
                    gameAction: AbilityDsl.actions.selectCard({
                        controller: Players.Any,
                        location: Location.PlayArea,
                        cardType: CardType.Character,
                        message: '{0} chooses to attach {1} to {2}',
                        messageArgs: (card, action, properties) => [
                            context.player,
                            (properties as any).attachment,
                            card
                        ],
                        gameAction: AbilityDsl.actions.attach()
                    })
                })),
                AbilityDsl.actions.shuffleDeck((context) => ({
                    deck: Location.ConflictDeck,
                    target: context.player
                }))
            ])
        });
    }
}
