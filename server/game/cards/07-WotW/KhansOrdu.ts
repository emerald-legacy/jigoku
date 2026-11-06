import { ConflictType, Players, Duration } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { setConflictDeclarationType } from '../../effects.js';
import { msg } from '../../GameChat.js';

export default class KhansOrdu extends ProvinceCard {
    static id = 'khan-s-ordu';

    override setupCardAbilities() {
        this.reaction('Make all conflicts military')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .switchConflictType((context) => ({
                targetConflictType: ConflictType.Military,
                target: context.game.currentConflict ? context.game.currentConflict.ring : []
            }))
            .playerLastingEffect({
                target: Players.Any,
                effect: setConflictDeclarationType(ConflictType.Military),
                duration: Duration.UntilEndOfPhase
            })
            .chatText((context) => context.game.isDuringConflict(ConflictType.Political)
                ? msg`switch the conflict type to ${'military'} and make all future conflicts ${'military'} for this phase`
                : msg`make all future conflicts ${'military'} for this phase`);
    }
}
