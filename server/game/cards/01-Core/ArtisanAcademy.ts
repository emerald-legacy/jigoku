import DrawCard from '../../DrawCard.js';
import { Locations, Decks, Phases, Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ArtisanAcademy extends DrawCard {
    static id = 'artisan-academy';

    setupCardAbilities() {
        this.action({
            title: 'Make top card of conflict deck playable',
            phase: Phases.Conflict,
            condition: context => context.player.conflictDeck.length > 0,
            effect: 'reveal the top card of their conflict deck',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => {
                let topCard = context.player.conflictDeck[0];
                return {
                    targetController: context.player,
                    duration: Durations.Custom,
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === Locations.ConflictDeck,
                        onPhaseEnded: () => true,
                        onDeckShuffled: event => event.player === context.player && event.deck === Decks.ConflictDeck
                    },
                    effect: [
                        AbilityDsl.effects.showTopConflictCard(),
                        AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDeck, [topCard], this)
                    ]
                };
            })
        });
    }
}


export default ArtisanAcademy;
