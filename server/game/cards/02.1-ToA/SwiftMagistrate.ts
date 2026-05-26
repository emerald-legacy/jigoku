import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SwiftMagistrate extends DrawCard {
    static id = 'swift-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context: any) => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((conflict: any, context: any) => {
                return (card: any) => card.getFate() > 0 && card !== context.source;
            })
        });
    }
}


export default SwiftMagistrate;
