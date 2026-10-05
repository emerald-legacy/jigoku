import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, Location, Decks } from '../../Constants.js';
import { playerChoices } from '../playerChoices.js';

class MasterpiecePainter extends DrawCard {
    static id = 'masterpiece-painter';

    setupCardAbilities() {
        this.action('Reveal and may play top conflict card')
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose any number of players'
            }, (context) => playerChoices(
                context.player,
                (player) => this.revealAndMayPlayAbility(player),
                (player, opponent) => AbilityDsl.actions.multiple([
                    this.revealAndMayPlayAbility(player),
                    this.revealAndMayPlayAbility(opponent)
                ])
            ))
            .effect('make {1} reveal the top card of their deck. They may play their card until the end of the phase', context => context.select);
    }

    revealAndMayPlayAbility(player: Player) {
        return AbilityDsl.actions.playerLastingEffect(() => {
            const topCard = player.conflictDeck[0];

            return {
                targetController: player,
                duration: Duration.Custom,
                until: {
                    onCardMoved: event => event.card === topCard && event.originalLocation === Location.ConflictDeck,
                    onPhaseEnded: () => true,
                    onDeckShuffled: event => event.player === player && event.deck === Decks.ConflictDeck
                },
                effect: [
                    AbilityDsl.effects.showTopConflictCard(),
                    AbilityDsl.effects.canPlayFromOwn(Location.ConflictDeck, [topCard], this)
                ]
            };
        });
    }
}


export default MasterpiecePainter;
