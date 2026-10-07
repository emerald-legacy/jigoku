import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type Player from '../../Player.js';
import { Location, CardType, TargetMode } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';

class AkodoMastermind extends DrawCard {
    static id = 'akodo-mastermind';

    setupCardAbilities() {
        this.action('Remove tactics to bow a character')
            .cost(costs.removeFromGame({
                cardType: [CardType.Event, CardType.Character, CardType.Attachment],
                location: Location.ConflictDiscardPile,
                mode: TargetMode.Unlimited,
                cardCondition: card => card.hasTrait('tactic')
            }))
            .condition(context => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.getGlory() <= this.getGloryCheck(context.player, context.costs.removeFromGame)
            }, bow())
            .cannotTargetFirst();
    }

    getGloryCheck(player: Player, removed: BaseCard | BaseCard[] | undefined) {
        if(removed) {
            return Array.isArray(removed) ? removed.length : 1;
        }
        return player.conflictDiscardPile.filter((card) => card.hasTrait('tactic')).length;
    }
}


export default AkodoMastermind;
