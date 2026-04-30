import DrawCard from '../../drawcard';
import { Locations, Decks, Durations } from '../../Constants';

class PillowBook extends DrawCard {
    static id = 'pillow-book';

    setupCardAbilities(ability) {
        this.action({
            title: 'Make top card of your conflict deck playable',
            condition: context => context.source.parent && context.source.parent.isParticipating() && context.player.conflictDeck.length > 0,
            effect: 'make the top card of their deck playable until the end of the conflict',
            gameAction: ability.actions.playerLastingEffect(context => {
                let topCard = context.player.conflictDeck[0];
                return {
                    targetController: context.player,
                    duration: Durations.Custom,
                    until: {
                        onCardMoved: event => event.card === topCard && event.originalLocation === Locations.ConflictDeck,
                        onConflictFinished: () => true,
                        onDeckShuffled: event => event.player === context.player && event.deck === Decks.ConflictDeck
                    },
                    effect: [
                        ability.effects.showTopConflictCard(),
                        ability.effects.canPlayFromOwn(Locations.ConflictDeck, [topCard], this)
                    ]
                };
            })
        });
    }
}


export default PillowBook;
