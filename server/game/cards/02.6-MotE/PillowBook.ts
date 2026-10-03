import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, Decks, Duration } from '../../Constants.js';

class PillowBook extends DrawCard {
    static id = 'pillow-book';

    setupCardAbilities() {
        this.action('Make top card of your conflict deck playable')
            .condition((context) => !!context.source.parentCharacter && context.source.parentCharacter.isParticipating() && context.player.conflictDeck.length > 0)
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => {
                const topCard = context.player.conflictDeck[0];
                return {
                    targetController: context.player,
                    duration: Duration.Custom,
                    until: {
                        onCardMoved: (event) => event.card === topCard && event.originalLocation === Location.ConflictDeck,
                        onConflictFinished: () => true,
                        onDeckShuffled: (event) => event.player === context.player && event.deck === Decks.ConflictDeck
                    },
                    effect: [
                        AbilityDsl.effects.showTopConflictCard(),
                        AbilityDsl.effects.canPlayFromOwn(Location.ConflictDeck, [topCard], this)
                    ]
                };
            }))
            .effect('make the top card of their deck playable until the end of the conflict');
    }
}


export default PillowBook;
