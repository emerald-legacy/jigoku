import { msg } from '../../GameChat.js';
import { CardType, Location } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { handler } from '../../GameActions/GameActions.js';

export default class ScavengingGoblin extends BaseOni {
    static id = 'scavenging-goblin';

    public override setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Remove cards from the game')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.opponent &&
                    context.player.opponent.conflictDeck.length > 0
            })
            .removeFromGame((context) => ({
                target: context.player.opponent?.conflictDeck.slice(0, 3) ?? [],
                location: Location.ConflictDeck
            }))
            .chatText((context) => msg`remove the top 3 cards of ${context.player.opponent ?? ''}'s conflict deck from the game as well as any matching attachments`)
            .then()
            .gameAction(handler({
                handler: (context) => {
                    const removed = this.removedCards(context);
                    const attachments = this.matchingAttachments(context);
                    context.game.addMessage(msg`${removed} ${removed.length > 1 ? 'are' : 'is'} removed from the game from the top of ${context.player.opponent}'s conflict deck`);
                    if(attachments.length > 0) {
                        context.game.addMessage(msg`${attachments} ${attachments.length > 1 ? 'are' : 'is'} removed from the game due to sharing a name with a card that was removed from the deck`);
                    }
                }
            }))
            .removeFromGame((context) => ({ target: this.matchingAttachments(context) }));
    }

    private removedCards(context: AbilityContext): BaseCard[] {
        return context.previousEvents.flatMap((event) => event.card && event.isFullyResolved() ? [event.card] : []);
    }

    private matchingAttachments(context: AbilityContext): BaseCard[] {
        const names = this.removedCards(context).map((card) => card.name);
        return this.game.allCards.filter((card) =>
            card.location === Location.PlayArea && card.type === CardType.Attachment &&
            card.controller !== context.player && names.includes(card.name));
    }
}
