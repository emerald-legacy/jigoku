import { reduceCost } from '../../effects.js';
import { Location, Phase, Players } from '../../Constants.js';
import { BattlefieldAttachment } from '../BattlefieldAttachment.js';

export default class FieldOfRuin extends BattlefieldAttachment {
    static id = 'field-of-ruin';

    public override setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: reduceCost({
                amount: 1,
                targetCondition: (target) => target.isProvinceCard() && target.isBroken,
                match: (card, source) => card === source
            })
        });

        this.reaction('discard each card in attached province')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Conflict
            })
            .discardCard((context) => ({
                target:
                    context.source.parentProvince?.controller.getDynastyCardsInProvince(context.source.parentProvince.location) ?? []
            }))
            .chatText('discard each card in the attached province');
    }

    protected override unbrokenOnly() {
        return false;
    }
}
