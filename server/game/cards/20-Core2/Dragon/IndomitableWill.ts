import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class IndomitableWill extends DrawCard {
    static id = 'indomitable-will';

    setupCardAbilities() {
        this.reaction('Prevent a character from bowing at the end of the conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.getNumberOfParticipantsFor(context.player) === 1
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.event.conflict?.getCharacters(context.player) ?? [],
                effect: AbilityDsl.effects.doesNotBow()
            })))
            .effect('prevent {1} from bowing as a result of the conflict\'s resolution', (context) => context.player.cardsInPlay.find((card) => card.isParticipating()))
            .cannotBeMirrored();
    }
}
