import { CardType, Location } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import { handler, multipleContext, removeFromGame } from '../../GameActions/GameActions.js';

export default class ScavengingGoblin extends BaseOni {
    static id = 'scavenging-goblin';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Remove cards from the game')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.opponent &&
                    context.player.opponent.conflictDeck.length > 0
            })
            .gameAction(multipleContext((context) => {
                const cardsToRemove = context.player.opponent?.conflictDeck.slice(0, 3) ?? [];
                const cardNames = cardsToRemove.map((card) => card.name);
                const attachmentsToRemove = this.game.allCards.filter((card) => {
                    if(card.location !== Location.PlayArea) {
                        return false;
                    }
                    if(card.type !== CardType.Attachment) {
                        return false;
                    }
                    if(card.controller === context.player) {
                        return false;
                    }
                    return cardNames.includes(card.name);
                });

                return {
                    gameActions: [
                        removeFromGame({
                            target: cardsToRemove,
                            location: Location.ConflictDeck
                        }),
                        removeFromGame({
                            target: attachmentsToRemove
                        }),
                        handler({
                            handler: (context) => {
                                context.game.addMessage(
                                    '{0} {1} removed from the game from the top of {2}\'s conflict deck',
                                    cardsToRemove,
                                    cardsToRemove.length > 1 ? 'are' : 'is',
                                    context.player.opponent
                                );
                                if(attachmentsToRemove.length > 0) {
                                    context.game.addMessage(
                                        '{0} {1} removed from the game due to sharing a name with a card that was removed from the deck',
                                        attachmentsToRemove,
                                        attachmentsToRemove.length > 1 ? 'are' : 'is'
                                    );
                                }
                            }
                        })
                    ]
                };
            }))
            .effect('remove the top 3 cards of {1}\'s conflict deck from the game as well as any matching attachments', (context) => [context.player.opponent ?? '']);
    }
}
