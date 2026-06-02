import { CardType, Location } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ScavengingGoblin extends BaseOni {
    static id = 'scavenging-goblin';
    private messageShown?: boolean;

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Remove cards from the game',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.opponent &&
                    context.player.opponent.conflictDeck.length > 0
            },
            effect: 'remove the top 3 cards of {1}\'s conflict deck from the game as well as any matching attachments',
            effectArgs: (context) => [context.player.opponent ?? ''],
            gameAction: AbilityDsl.actions.multipleContext((context) => {
                const cardsToRemove = context.player.opponent.conflictDeck.slice(0, 3);
                const cardNames = cardsToRemove.map((card: any) => card.name);
                const attachmentsToRemove = this.game.allCards.filter((card) => {
                    if(card.location !== 'play area') {
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

                this.messageShown = false;
                return {
                    gameActions: [
                        AbilityDsl.actions.removeFromGame({
                            target: cardsToRemove,
                            location: Location.ConflictDeck
                        }),
                        AbilityDsl.actions.removeFromGame({
                            target: attachmentsToRemove
                        }),
                        AbilityDsl.actions.handler({
                            handler: (context) => {
                                if(!this.messageShown) {
                                    // for some reason, it shows the message twice
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
                            }
                        })
                    ]
                };
            })
        });
    }
}
