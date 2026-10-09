import DrawCard from '../../DrawCard.js';
import { Location, DeckType, Phase, Duration } from '../../Constants.js';
import { canPlayFromOwn, showTopConflictCard } from '../../effects.js';

class ArtisanAcademy extends DrawCard {
    static id = 'artisan-academy';

    setupCardAbilities() {
        this.action('Make top card of conflict deck playable')
            .condition((context) => context.player.conflictDeck.length > 0)
            .playerLastingEffect((context) => {
                const topCard = context.player.conflictDeck[0];
                return {
                    targetController: context.player,
                    duration: Duration.Custom,
                    until: {
                        onCardMoved: (event) => event.card === topCard && event.originalLocation === Location.ConflictDeck,
                        onPhaseEnded: () => true,
                        onDeckShuffled: (event) => event.player === context.player && event.deck === DeckType.Conflict
                    },
                    effect: [
                        showTopConflictCard(),
                        canPlayFromOwn(Location.ConflictDeck, [topCard], this)
                    ]
                };
            })
            .chatText('reveal the top card of their conflict deck')
            .phase(Phase.Conflict);
    }
}


export default ArtisanAcademy;
