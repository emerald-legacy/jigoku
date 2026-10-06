import DrawCard from '../../DrawCard.js';
import { Location, Decks, Phases, Duration } from '../../Constants.js';
import { canPlayFromOwn, showTopConflictCard } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

class ArtisanAcademy extends DrawCard {
    static id = 'artisan-academy';

    setupCardAbilities() {
        this.action('Make top card of conflict deck playable')
            .condition(context => context.player.conflictDeck.length > 0)
            .gameAction(playerLastingEffect(context => {
                const topCard = context.player.conflictDeck[0];
                return {
                    targetController: context.player,
                    duration: Duration.Custom,
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === Location.ConflictDeck,
                        onPhaseEnded: () => true,
                        onDeckShuffled: event => event.player === context.player && event.deck === Decks.ConflictDeck
                    },
                    effect: [
                        showTopConflictCard(),
                        canPlayFromOwn(Location.ConflictDeck, [topCard], this)
                    ]
                };
            }))
            .effect('reveal the top card of their conflict deck')
            .phase(Phases.Conflict);
    }
}


export default ArtisanAcademy;
