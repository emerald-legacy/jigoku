import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, Location, Decks } from '../../Constants.js';

class MasterpiecePainter extends DrawCard {
    static id = 'masterpiece-painter';

    setupCardAbilities() {
        this.action('Reveal and may play top conflict card')
            .select('target', {
                targets: true,
                activePromptTitle: 'Choose any number of players'
            }, {
                [this.owner.name]: this.revealAndMayPlayAbility(this.owner),
                [this.owner.opponent && this.owner.opponent.name || 'NA']: this.revealAndMayPlayAbility(this.owner.opponent),
                [this.owner.name + ' and ' + (this.owner.opponent && this.owner.opponent.name || 'NA')]: AbilityDsl.actions.multiple([
                    this.revealAndMayPlayAbility(this.owner),
                    this.revealAndMayPlayAbility(this.owner.opponent)
                ])
            })
            .effect('make {1} reveal the top card of their deck. They may play their card until the end of the phase.', context => context.select);
    }

    revealAndMayPlayAbility(player: Player | undefined) {
        return AbilityDsl.actions.playerLastingEffect(() => {
            let chosenPlayer = player as Player;
            let topCard = chosenPlayer.conflictDeck[0];

            return {
                targetController: player,
                duration: Duration.Custom,
                until: {
                    onCardMoved: event => event.card === topCard && event.originalLocation === Location.ConflictDeck,
                    onPhaseEnded: () => true,
                    onDeckShuffled: event => event.player === chosenPlayer && event.deck === Decks.ConflictDeck
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
