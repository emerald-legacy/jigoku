import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import { Location, Phases, Players } from '../../Constants.js';
import { BattlefieldAttachment } from '../BattlefieldAttachment.js';

export default class FieldOfRuin extends BattlefieldAttachment {
    static id = 'field-of-ruin';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: BaseCard) => target.isProvinceCard() && target.isBroken,
                match: (card: BaseCard, source: BaseCard) => card === source
            })
        });

        this.reaction('discard each card in attached province')
            .when({
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            })
            .gameAction(AbilityDsl.actions.discardCard((context) => ({
                target:
                    context.source.parentProvince?.controller.getDynastyCardsInProvince(context.source.parentProvince.location) ?? []
            })))
            .effect('discard each card in the attached province');
    }

    protected unbrokenOnly() {
        return false;
    }
}
