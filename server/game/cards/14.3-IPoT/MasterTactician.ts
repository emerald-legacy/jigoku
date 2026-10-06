import AbilityDsl from '../../abilitydsl.js';
import { Location, Players, PlayType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { LimitedPlaysFromOutOfPlay } from '../LimitedPlaysFromOutOfPlay.js';

export default class MasterTactician extends DrawCard {
    static id = 'master-tactician';

    public setupCardAbilities() {
        const plays = new LimitedPlaysFromOutOfPlay<this>(this, {
            max: 3,
            active: (context) => context.source.isParticipating() && context.game.isTraitInPlay('battlefield'),
            allows: (event) => event.originalLocation === Location.ConflictDeck && !!event.originallyOnTopOfConflictDeck,
            description: 'plays a card from their conflict deck'
        });

        this.persistentEffect({
            condition: (context) =>
                context.game.isTraitInPlay('battlefield') &&
                context.source.isParticipating() &&
                plays.available,
            targetLocation: Location.ConflictDeck,
            targetController: Players.Self,
            match: (card, context) =>
                !!(context && context.player.conflictDeck.length > 0 && card === context.player.conflictDeck[0]),
            effect: AbilityDsl.effects.canPlayFromOutOfPlay(
                (player, card) => player === card.owner,
                PlayType.PlayFromHand
            )
        });

        this.persistentEffect({
            condition: (context) => {
                const defending = context.game.currentConflict && context.player.isDefendingPlayer();
                const preventShowing = defending && !context.game.currentConflict?.defendersChosen;
                return context.game.isTraitInPlay('battlefield') && context.source.isParticipating() && !preventShowing;
            },
            targetController: Players.Self,
            effect: AbilityDsl.effects.showTopConflictCard(Players.Self)
        });
    }
}
