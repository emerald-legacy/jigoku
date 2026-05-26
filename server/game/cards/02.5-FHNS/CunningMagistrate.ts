import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class CunningMagistrate extends DrawCard {
    static id = 'cunning-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: AbilityDsl.effects.cannotContribute((conflict: any, context: any) => {
                return (card: DrawCard) => card.isDishonored && card !== context.source;
            })
        });
    }
}


export default CunningMagistrate;
