import { TokenType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class FortifiedAssembly extends ProvinceCard {
    static id = 'fortified-assembly';

    setupCardAbilities() {
        this.reaction({
            title: 'Place an honor token on this province',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            gameAction: AbilityDsl.actions.addToken(),
            effect: 'put an honor token on {0}',
            effectArgs: (context) => context.source
        });
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyProvinceStrength(() => this.getTokenCount(TokenType.Honor) * 2)
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
