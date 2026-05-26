import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Locations, Decks, Durations } from '../../Constants.js';

class PillowBook extends DrawCard {
    static id = 'pillow-book';

    setupCardAbilities() {
        this.action({
            title: 'Make top card of your conflict deck playable',
            condition: (context: AbilityContext) => !!context.source.parent && context.source.parent.isParticipating() && context.player.conflictDeck.length > 0,
            effect: 'make the top card of their deck playable until the end of the conflict',
            gameAction: AbilityDsl.actions.playerLastingEffect((context: AbilityContext) => {
                let topCard = context.player.conflictDeck[0];
                return {
                    targetController: context.player,
                    duration: Durations.Custom,
                    until: {
                        onCardMoved: (event: any) => event.card === topCard && event.originalLocation === Locations.ConflictDeck,
                        onConflictFinished: () => true,
                        onDeckShuffled: (event: any) => event.player === context.player && event.deck === Decks.ConflictDeck
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


export default PillowBook;
