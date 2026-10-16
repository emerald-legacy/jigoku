import { ConflictType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

export default class IvoryKingdomsUnicorn extends DrawCard {
    static id = 'ivory-kingdoms-unicorn';

    public override setupCardAbilities() {
        this.reaction('Immediately declare a military conflict')
            .when({
                onConflictFinished: (event, context) =>
                    event.conflict.brokenProvinces.length > 0 && event.conflict.attackersAtResolution.includes(context.source)
            })
            .initiateConflict({
                canPass: false,
                forcedDeclaredType: ConflictType.Military
            });
    }
}
