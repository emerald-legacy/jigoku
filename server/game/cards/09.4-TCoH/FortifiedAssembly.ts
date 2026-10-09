import { TokenType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { modifyProvinceStrength } from '../../effects.js';
import { addToken } from '../../GameActions/GameActions.js';

export default class FortifiedAssembly extends ProvinceCard {
    static id = 'fortified-assembly';

    setupCardAbilities() {
        this.reaction('Place an honor token on this province')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .gameAction(addToken())
            .chatText('put an honor token on {0}');
        this.persistentEffect({
            effect: modifyProvinceStrength(() => this.getTokenCount(TokenType.Honor) * 2)
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
