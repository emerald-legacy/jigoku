import { CardType, Location, PlayType, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class KyudenIsawa extends StrongholdCard {
    static id = 'kyuden-isawa';

    setupCardAbilities() {
        this.action({
            title: 'Play a spell event from discard',
            cost: [
                AbilityDsl.costs.bowSelf(),
                AbilityDsl.costs.discardCard({
                    cardCondition: (card) => card.hasTrait('spell') && card.type === CardType.Event
                })
            ],
            condition: () => this.game.isDuringConflict(),
            effect: 'play a spell event from discard',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose a spell event',
                cardType: CardType.Event,
                controller: Players.Self,
                location: Location.ConflictDiscardPile,
                cardCondition: (card) => card.hasTrait('spell'),
                gameAction: AbilityDsl.actions.playCard({
                    resetOnCancel: true,
                    source: this,
                    playType: PlayType.PlayFromHand,
                    postHandler: (spellContext) => {
                        const card = spellContext.source;
                        context.game.addMessage('{0} is removed from the game by {1}\'s ability', card, context.source);
                        context.player.moveCard(card, Location.RemovedFromGame);
                    }
                })
            }))
        });
    }
}
