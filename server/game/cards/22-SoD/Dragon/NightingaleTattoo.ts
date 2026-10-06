import { Players, TargetMode, Location, CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { addTrait } from '../../../effects.js';
import { assignRoles, removeFromGame, returnToDeck } from '../../../GameActions/GameActions.js';
import { msg } from '../../../GameChat.js';

export default class NightingaleTattoo extends DrawCard {
    static id = 'nightingale-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'monk'
        });

        this.whileAttached({
            effect: addTrait('tattooed')
        });

        this.action('Pick two cards in your discard pile')
            .targetCards({
                mode: TargetMode.Exactly,
                activePromptTitle: 'Choose two conflict cards',
                numCards: 2,
                location: Location.ConflictDiscardPile,
                cardType: [CardType.Character, CardType.Attachment, CardType.Event],
                cardCondition: (card) => card.hasTrait('kiho') || card.hasTrait('tattoo'),
                controller: Players.Self
            }, assignRoles({
                player: Players.Opponent,
                pick: 'shuffle',
                activePromptTitle: 'Choose a card to shuffle into your opponent\'s deck',
                roles: {
                    shuffle: returnToDeck({ location: Location.ConflictDiscardPile, shuffle: true }),
                    remove: removeFromGame({ location: Location.ConflictDiscardPile })
                },
                message: (assigned, context) =>
                    msg`${context.player.opponent} chooses ${assigned.shuffle} to be shuffled into ${context.player}'s deck. ${assigned.remove} is removed from the game`
            }))
            .effect((context) => msg`have ${context.player.opponent} shuffle one of ${context.targets.target} into ${context.player}'s conflict deck`);
    }
}
