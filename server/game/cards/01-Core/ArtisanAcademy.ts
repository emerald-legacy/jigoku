import DrawCard from '../../DrawCard.js';
import { Location, Decks, Phases, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ArtisanAcademy extends DrawCard {
    static id = 'artisan-academy';

    setupCardAbilities() {
        this.action('Make top card of conflict deck playable')
            .condition(context => context.player.conflictDeck.length > 0)
            .gameAction(AbilityDsl.actions.playerLastingEffect(context => {
                let topCard = context.player.conflictDeck[0];
                return {
                    targetController: context.player,
                    duration: Duration.Custom,
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === Location.ConflictDeck,
                        onPhaseEnded: () => true,
                        onDeckShuffled: event => event.player === context.player && event.deck === Decks.ConflictDeck
                    },
                    effect: [
                        AbilityDsl.effects.showTopConflictCard(),
                        AbilityDsl.effects.canPlayFromOwn(Location.ConflictDeck, [topCard], this)
                    ]
                };
            }))
            .effect('reveal the top card of their conflict deck')
            .phase(Phases.Conflict);
    }
}


export default ArtisanAcademy;
