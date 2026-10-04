import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import DrawCard from '../../../DrawCard.js';
import { Duration } from '../../../Constants.js';

export default class RecklessAssault extends DrawCard {
    static id = 'reckless-assault';

    setupCardAbilities() {
        this.reaction('Force defenders')
            .when({
                onConflictDeclared: (event, context) =>
                    event.conflict.getNumberOfParticipantsFor(context.player) === 1 &&
                    event.conflict.getParticipants(
                        participant => participant.hasTrait('berserker') && participant.controller === context.player
                    ).length === 1 &&
                    context.player === event.conflict.attackingPlayer
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: this.getCharacters(context),
                duration: Duration.UntilEndOfConflict,
                effect: AbilityDsl.effects.cannotBeDeclaredAsDefender()
            })))
            .effect('prevent characters with less than 3{1} from defending (this affects {2})', (context) => ['military', this.getCharacters(context)]);
    }

    private getCharacters(context: AbilityContext) {
        return context.player.opponent?.cardsInPlay.filter(card => card.getMilitarySkill() < 3) ?? [];
    }
}
